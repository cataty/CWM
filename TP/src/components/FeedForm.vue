<script>
import supabase from '../services/supabase';
import { uploadFile, getFileURL } from '../services/storage';

export default {
  name: "FeedForm",
  props: {
    user: {
      type: Object,
      required: true
    },
    deal: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    deal(newValue, oldValue) {
      // This code runs whenever the 'deal' prop changes
      console.log('deal changed from', oldValue, 'to', newValue);
      // You can react to the change here
    }
  },
  data() {
    return {
      newPost: {
        user_id: "",
        content: "",
        image: "",
        date: new Date().toLocaleString(),
      },
      imagePreview: "",
      imageFile: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },

    async handleFileUpload() {
      if (!this.imageFile) {
        console.warn("No image selected.");
        return null;
      }

      const fileName = `posts/${Date.now()}_${this.imageFile.name}`;
      uploadFile(this.imageFile, fileName, "images");
      const publicURL = getFileURL(fileName, "images");
      this.newPost.image = publicURL;

    },

    async handleSubmit() {
      if (!this.user || !this.user.id) {
        console.error('User not logged in.');
        return;
      }

      await this.handleFileUpload();

      this.$emit('post-submitted', {
        content: this.newPost.content,
        created_at: this.newPost.date,
        image: this.newPost.image || '',
        user_id: this.user.id,
      });

      // Reset form
      this.newPost.content = '';
      this.imagePreview = '';
      this.imageFile = null;
    }
  },
  emits: {
    'post-submitted': payload =>
      typeof payload.content === 'string' &&
      payload.content.trim().length > 0 &&
      typeof payload.image === 'string' &&
      typeof payload.created_at === 'string' &&
      typeof payload.user_id === 'string' &&
      payload.user_id.trim().length > 0
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-160 mt-4">
    <div class="mb-4">
      <h2 class="block mb-2 text-indigo-700 font-bold">
        <slot />
      </h2>

      <div v-if="!deal" class="my-4">
        <img v-if="imagePreview" :src="imagePreview" alt="Vista previa" class="mb-4 w-24 h-24 object-cover" />
        <label for="image" class="mb-2 text-lg font-semibold">Imagen</label>
        <input id="image" type="file" @change="handleFileChange($event)" />
      </div>

      <div>
        <label for="content" class="mb-2 text-lg font-semibold">Contenido</label>
        <textarea id="content" class="border border-indigo-900 rounded py-2 px-4 w-full"
          v-model="newPost.content"></textarea>
      </div>
    </div>

    <button type="submit" class="py-2 px-4 rounded-full bg-indigo-500 text-white">
      Enviar
    </button>
  </form>
</template>
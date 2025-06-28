<script>
import AppH1 from '../components/AppH1.vue';
import AppFeed from '../components/AppFeed.vue';

export default {
    name: 'Feed',
    components: {
        AppH1,
        AppFeed,

    },
    data() {
        return {
            newPost: {
                "email": "user",
                "content": "",
                "image": "",
            },

        }
    },
    methods: {
        sendPost() {
            this.posts.push({
                email: "user",
                content: this.newPost.content,
                image: this.newPost.image
            });
            this.newPost.content = "";
        }
    }
}
</script>

<template>
    <AppH1> Feed de ofertas </AppH1>
    <AppFeed />
</template>
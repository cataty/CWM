<script>
import { fetchPostComments, fetchPostById, saveFeedComment } from '../services/feed';
import { getUserProfileById } from '../services/users';
import FeedForm from '../components/FeedForm.vue';
import AppH1 from '../components/AppH1.vue';
import { subscribeToAuth } from '../services/auth';

export default {
    name: 'Comments',
    components: { AppH1, FeedForm },
    data() {
        return {
            post: {},
            comments: [],
            user: {},
            loading: false,
            deal: true
        }
    },
    methods: {
        async publishComment(newComment) {
            try {
                // Attach post_id to the comment before saving
                newComment.post_id = this.post.id;
                await saveFeedComment(newComment);
                // Refresh comments after posting
                this.comments = await fetchPostComments(this.post.id);
                // Resolve profiles for each comment
                for (const comment of this.comments) {
                    try {
                        comment.profile = await getUserProfileById(comment.user_id);
                    } catch (error) {
                        console.error("Error trayendo los datos de perfil:", error);
                    }
                }
            } catch (error) {
                console.error("Error publicando el comentario:", error);
            }
        }
    },
    async mounted() {
        try {
            subscribeToAuth(newUser => this.user = newUser);
            this.loading = true;
            this.post = await fetchPostById(this.$route.params.id);
            if (this.post && this.post.user_id) {
                try {
                    this.post.profile = await getUserProfileById(this.post.user_id);
                } catch (error) {
                    console.error("Error trayendo el perfil del autor del post:", error);
                }
            }
            this.comments = await fetchPostComments(this.$route.params.id);
            for (const comment of this.comments) {
                try {
                    comment.profile = await getUserProfileById(comment.user_id);
                } catch (error) {
                    console.error("Error trayendo los datos de perfil:", error);
                }
            }
            this.loading = false;
        } catch (error) {
            this.loading = false;
            console.error("Error cargando los datos del Post: ", error);
        }
    }
}
</script>

<template>
    <AppH1>Oferta</AppH1>
    <div v-if="!loading" class="max-w-120 mx-auto">
        <section>
            <div
                class="flex flex-col gap-2 mb-4 border border-indigo-300 bg-indigo-100 rounded p-4 shadow-md basis-full">
                <p class="text-xs text-indigo-700 flex justify-between"><span class="font-bold">{{
                    post.profile?.display_name || ("usuario " + post.user_id) }}
                    </span> <span>{{ post.created_at ? post.created_at.replace('T', ' ').substring(0, 19) : '' }}</span>
                </p>
                <p class="p-4 bg-white rounded">{{ post.content }}
                </p>
            </div>
            <h2 class="text-lg font-bold text-indigo-700 my-8 text-center">Comentarios</h2>
            <ol v-if="comments.length > 0" class="mb-8">
                <li v-for="comment in comments"
                    class="flex flex-col gap-2 mb-4 border border-indigo-300 rounded p-4 shadow-md" :key="comment.id">
                    <p class="text-xs text-indigo-700 flex justify-between"><span class="font-bold">{{
                        comment.profile?.display_name || ("usuario " + comment.user_id) }}
                        </span><span>{{ comment.created_at ? comment.created_at.replace('T', ' ').substring(0, 19) : ''
                            }}</span></p>
                    <p class="py-4">{{ comment.content }}</p>
                    <div v-if="authUser.id === post.user_id">
                        <router-link :to="`/post/editar/${post.id}`" class="text-sm font-bold text-indigo-600">
                            editar post
                        </router-link>
                    </div>
                </li>
            </ol>
            <div v-else>
                Esta oferta aún no tiene comentarios. Sé el primero en publicar uno!
            </div>
        </section>
    </div>
    <div v-else class="flex justify-center items-center h-64">
        <p class="font-bold text-indigo-700"> cargando...</p>
    </div>
    <section class="max-w-120 mx-auto">
        <FeedForm :user="user" :deal="deal" @post-submitted="publishComment"> Publicar Comentario
        </FeedForm>
    </section>

</template>
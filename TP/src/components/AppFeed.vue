<script>
import { fetchFeed, saveFeedPost, saveFeedComment, subscribeToFeed, fetchPostComments, updatePost, deletePost } from '../services/feed.js';
import { subscribeToAuth } from '../services/auth.js';
import { getUserProfileById } from '../services/users.js'
import FeedForm from './FeedForm.vue';
import FeedList from './FeedList.vue';
import NotificationBox from './NotificationBox.vue';

export default {
    name: 'AppFeed',
    components: {
        FeedForm,
        FeedList
    },
    /*     props: {
            user: {
                type: Object,
                required: true
            }
        }, */
    data: function () {
        return {
            posts: [],
            user: {},
            loading: false,
        }
    },
    methods: {
        async publishPost(newPost) {
            try {
                await saveFeedPost(newPost); // Guardar en supabase
                // Refresh feed after posting
                const posts = await fetchFeed();
                this.posts = posts;
                await this.resolveNames();
            } catch (error) {
                console.error("Error publicando el post:", error);
            }
        },
        async publishComment(newComment) {
            console.log(newComment)
            /*             this.posts.push({
                                        email: "user",
                                        content: newPost.content,
                                        date: newPost.date,
                                    }); */
            try {
                await saveFeedComment(newComment); // Guardar en supabase
            } catch (error) {
                console.error("Error publicando el comentario:", error);
            }

        },
        async editPost(editedPost) {
            try {
                await updatePost(editedPost.id, editedPost);
                // Refresh feed after editing
                const posts = await fetchFeed();
                this.posts = posts;
                await this.resolveNames();
            } catch (error) {
                console.error("Error editando el post:", error);
            }
        },
        async deletePost(postId, imageUrl) {
            try {
                await deletePost(postId, imageUrl);
                // Refresh feed after deleting  
                const posts = await fetchFeed();
                this.posts = posts;
                await this.resolveNames();
            } catch (error) {
                console.error("Error editando el post:", error);
            }
        },
        async resolveNames() {
            for (const post of this.posts) {
                try {
                    const profileData = await getUserProfileById(post.user_id || (post.user && post.user.id));
                    post.profile = profileData || { display_name: null };
                } catch (error) {
                    console.error("Error trayendo los datos de perfil:", error);
                    post.profile = { display_name: null };
                }
            }
        }
    },
    async mounted() {
        subscribeToAuth(newUser => this.user = newUser);
        this.loading = true;
        subscribeToFeed(newPostReceived => {
            this.posts.unshift(newPostReceived);
        });
        try {
            const posts = await fetchFeed();
            this.posts = posts;
            await this.resolveNames();
        } catch (error) {
            console.error("Error trayendo el feed:", error);
        }
        this.loading = false;
    }
}

</script>

<template>
    <NotificationBox />
    <section class="flex flex-col lg:flex-row gap-4 max-w-6xl mx-auto content-around justify-start">
        <div class="flex gap-2 max-w-140 lg:w-8/12 mx-auto">

            <FeedList :posts="posts" :user="user" ref="feedList" @post-submitted="publishComment" />
        </div>

        <div class="p-8 max-w-140 lg:w-4/12 mx-auto border border-indigo-700 shadow-lg">
            <p class="mb-8 ">Acá podés publicar una oferta. No te olvides de los detalles como el producto, el precio,
                la
                vigencia de la oferta y la dirección del supermercado.</p>
            <FeedForm :user="user" @post-submitted="publishPost"> Publicar Oferta </FeedForm>
        </div>
    </section>
</template>
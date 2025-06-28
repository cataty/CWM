<script setup>
import { computed } from 'vue';

const props = defineProps({
    content:""
});

defineEmits(['close']);

const CLASSES_MAP = {
    success: 'bg-green-100',
    error: 'bg-red-100',
}


const colorClasses = computed(() => CLASSES_MAP[props.content.type] || '');
</script>

<template>
    <div
        class="relative flex gap-4 p-4 mb-4 rounded"
        :class="colorClasses"
    >
        <div
            v-if="colorClasses == success"
            class="p-2 py-2"
        >
<img src="/img/check.png" alt="Check icon" />
        </div>
                <div
            v-else-if="colorClasses == error"
            class="p-2 py-2"
        >
<img src="/img/check.png" alt="Check icon" />
        </div>
        <div>
            <slot name="header" />
            <div>
                {{ content.message }}
            </div>
        </div>
        <button
            v-if="content.closable !== false"
            type="button"
            class="flex justify-center items-center absolute top-0 right-0 h-14 w-14"
            @click="$emit('close')"
        >&times;</button>
    </div>
</template>
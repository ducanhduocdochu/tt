<template>
    <div class="prose dark:prose-invert max-w-none">
        <div v-html="compiledMarkdown" class="markdown-body"></div>
    </div>
</template>

<script setup>
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const props = defineProps({
    content: {
        type: String,
        required: true
    }
})

marked.setOptions({
    highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value
        }
        return hljs.highlightAuto(code).value
    }
})

const compiledMarkdown = marked.parse(props.content)
</script>

<style>
.markdown-body pre {
    background-color: #2d2d2d;
    color: #fff;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.875rem;
}

.markdown-body code {
    font-family: 'Fira Code', 'Courier New', monospace;
}
</style>
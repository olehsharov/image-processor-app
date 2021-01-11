<template>
    <div class="px-4 py-2 border-b border-gray-900 text-shadow flex items-center">
        <div class="flex flex-col items-start w-full">
            <div class="uppercase text-gray-500 font-bold h-6"><slot></slot></div>
            <div class="w-full"></div>
            <span class="text-gray-700 h-8" style="font-size:10px"><slot name="subtitle"></slot></span>
        </div>
        <slot name="action"></slot>
    </div>
</template>
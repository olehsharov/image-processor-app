<template>
    <div class="px-4 py-2 border-b border-gray-900 text-shadow flex items-center">
        <div class="flex flex-col items-start w-full">
            <div class="uppercase text-gray-500 font-bold h-6"><slot></slot></div>
        </div>
        <slot name="action"></slot>
    </div>
</template>
<template>
	<div class="filtersWrapper">
		<ul class="filtersWrapper__list">
			<li class="filtersWrapper__tab" :class="{ selected: selectedFilter == title }" v-for="title in tabTitles" :key="title" @click="selectFilter(title)">
				{{ title }}
			</li>
		</ul>

		<slot />
	</div>
</template>

<script>
	import { defineComponent, provide, reactive, ref, onMounted, useFetch, onActivated, computed, watch, useContext } from "@nuxtjs/composition-api";
	import store from "@/store.js";
	import axios from "axios";

	export default defineComponent({
		props: {
			title: {
				type: String
			}
		},
		setup(props, { slots }) {
			const tabTitles = ref({});
			const selectedFilter = ref({});
			onMounted(() => {
				tabTitles.value = slots.default().map(tab => tab.componentOptions?.propsData.title);
				tabTitles.value = tabTitles.value.filter(item => !!item);
				selectedFilter.value = tabTitles.value[0];
			});

			const selectFilter = title => {
				selectedFilter.value = title;
			};
			provide("selectedFilter", selectedFilter);
			store.setSelectedFilter(selectedFilter);

			return {
				tabTitles,
				selectedFilter,
				selectFilter
			};
		}
	});
</script>

<style lang="scss">
	.filtersWrapper {
		overflow: hidden;
		&__list {
			display: grid;
			grid-template-columns: 1fr 1fr 1fr;
			gap: 0 8px;
			margin-bottom: 24px;
		}

		&__tab {
			padding: 8px 0;
			font-size: 14px;
			font-weight: 600;
			text-align: center;
			text-transform: uppercase;
			cursor: pointer;
			background: #dcdcdc;

			&.selected {
				background: var(--color-primary);
				color: #fff;
			}
		}
	}
</style>

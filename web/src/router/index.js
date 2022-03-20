import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
function validateFileName(str) {
	return (
		/^\S+\.vue$/.test(str) &&
		str.replace(/^\S+\/(\w+)\.vue$/, (rs, $1) => capitalizeFirstLetter($1))
	);
}
const dynamicRouters = [];
const requireComponent = require.context("../views", true, /\.vue$/);
requireComponent.keys().forEach((filePath) => {
	const componentConfig = requireComponent(filePath);
	const fileName = validateFileName(filePath);
	const componentName =
		fileName.toLowerCase() === "index"
			? capitalizeFirstLetter(componentConfig.default.name)
			: fileName;
	console.log(componentName, fileName, filePath);
	dynamicRouters.push({
		path:  fileName.toLowerCase(),
		name: fileName,
		component: componentConfig.default
	});
	// Vue.component(componentName, componentConfig.default || componentConfig);
});

console.log(dynamicRouters);


const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
		children: [
			{
				path: "about",
				name: "About",
				// route level code-splitting
				// this generates a separate chunk (about.[hash].js) for this route
				// which is lazy-loaded when the route is visited.
				/* webpackChunkName: "about" */

				// component: () => import("../../../web/src/views/About.vue"),
				component: () => import("../views/About.vue"),
				// component: () =>
				// 	import(
				// 		"C:\\Users\\MACHENIKE\\Desktop\\vue-menu-page\\web\\src\\views\\About.vue"
				// 	),
			},
			...dynamicRouters,
		],
	},
];

const router = new VueRouter({
	routes,
});

export default router;

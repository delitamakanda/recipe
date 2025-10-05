<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<header class="bg-base-100 shadow-md sticky top-0 z-50">
	<div class="navbar container mx-auto px-4">
		<div class="navbar-start">
			<a href="/" class="flex items-center">
				<img src="{base}/logo.svg" alt="logo" class="h-10 w-auto" />
				<span class="ml-2 text-xl font-bold hidden sm:block">Recipe App</span>
			</a>
		</div>
		<div class="navbar-end">
			<div class="flex">
				<ul class="menu menu-horizontal px-1">
					<li class:active={$page.url.pathname === '/create'}>
						<a
							class="rounded-lg hover:bg-base-200 transition-colors duration-200"
							class:font-bold={$page.url.pathname === '/create'}
							href="/create">Create recipe</a>
					</li>
					<li class:active={$page.url.pathname === '/about'}>
						<a
							class="rounded-lg hover:bg-base-200 transition-colors duration-200"
							class:font-bold={$page.url.pathname === '/about'}
							href="/about">About</a>
					</li>
					<li class:active={$page.url.pathname === '/contact'}>
						<a
							class="rounded-lg hover:bg-base-200 transition-colors duration-200"
							class:font-bold={$page.url.pathname === '/contact'}
							href="/contact">Contact</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</header>

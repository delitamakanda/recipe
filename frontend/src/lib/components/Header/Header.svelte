<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<header>
	<nav>
		<ul>
			<li class:active={$page.url.pathname === '/'}>
				<a href="/">
					<img src="{base}/logo.svg" alt="logo" width="50px" height="auto" />
				</a>
			</li>
		</ul>
	</nav>
</header>

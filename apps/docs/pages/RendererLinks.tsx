export function RendererLinks({reactRoute}: {reactRoute: string}) {
	return <nav className="framework-switcher" aria-label="Renderer example">
		<a aria-current="page" href={`#/${reactRoute}`}>React</a>
		<a href="./vue/#/research">Vue</a>
	</nav>
}

document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;
    const isInsidePaginas = currentPath.includes("/paginas/");
    const basePath = isInsidePaginas ? ".." : ".";

    const loadFragment = (containerId, fragmentPath) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        fetch(`${basePath}/${fragmentPath}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Não foi possível carregar ${fragmentPath}`);
                }
                return response.text();
            })
            .then(html => {
                container.innerHTML = html;
            })
            .catch(error => {
                console.error(error);
            });
    };

    loadFragment("header-container", "fragments/header.html");
    loadFragment("footer-container", "fragments/footer.html");
});

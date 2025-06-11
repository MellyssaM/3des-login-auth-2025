const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '../login/index.html';
        }

        async function loadPosts() {
            try {
                const response = await fetch('http://localhost:3000/posts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const posts = await response.json();
                    displayPosts(posts);
                } else if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    window.location.href = '../login/index.html';
                } else {
                    throw new Error('Erro ao carregar posts');
                }
            } catch (error) {
                console.error('Erro:', error);
                document.getElementById('postsContainer').innerHTML =
                    '<div class="error">Erro ao carregar posts. Verifique se o servidor está rodando.</div>';
            }
        }

        function displayPosts(posts) {
            const container = document.getElementById('postsContainer');

            if (posts.length === 0) {
                container.innerHTML = '<p>Nenhum post encontrado.</p>';
                return;
            }

            const postsHTML = posts.map(post => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <div class="post-meta">Publicado em: ${formatDate(post.date)}</div>
                    <p>${post.content}</p>
                    <div class="post-stats">
                        <span>👍 ${post.likes} curtidas</span>
                        <span>👁️ ${post.views} visualizações</span>
                    </div>
                </div>
            `).join('');

            container.innerHTML = postsHTML;
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        }

        function logout() {
            localStorage.removeItem('token');
            window.location.href = '../login/index.html';
        }

        window.addEventListener('load', loadPosts);
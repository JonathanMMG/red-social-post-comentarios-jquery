// main.js

$(document).ready(() => {
    // Renderiza las publicaciones almacenadas al cargar la página
    renderPosts();

    // Evento para agregar una nueva publicación
    $('#add-post').on('click', () => {
        const title = $('#post-title').val().trim();
        const description = $('#post-description').val().trim();

        // Verifica que los campos de título y descripción no estén vacíos
        if (!title || !description) {
            Swal.fire('Error', 'El título y la descripción no deben estar vacíos', 'error');
            return;
        }

        // Agrega la nueva publicación y renderiza las publicaciones actualizadas
        addPost(title, description);
        renderPosts();

        // Limpia los campos del formulario después de agregar la publicación
        $('#post-title').val('');
        $('#post-description').val('');
    });

    // Evento para filtrar publicaciones por palabra clave en el título
    $('#search').on('input', () => {
        const keyword = $('#search').val().trim();
        renderPosts(filterPosts(keyword));
    });

    // Delegación de eventos para manejar acciones en publicaciones y comentarios
    $('#posts-container')
        // Evento para agregar un comentario a una publicación
        .on('click', '.add-comment', function() {
            const postId = $(this).data('post-id');
            const commentText = $(this).siblings('.comment-input').val().trim();

            // Verifica que el comentario no esté vacío
            if (!commentText) {
                Swal.fire('Error', 'El comentario no debe estar vacío', 'error');
                return;
            }

            // Agrega el comentario y renderiza los comentarios actualizados
            addComment(postId, commentText);
            $(this).siblings('.comment-input').val('');
        })
        // Evento para editar una publicación
        .on('click', '.edit-post', function() {
            const postId = $(this).data('post-id');
            const post = getPostById(postId);

            // Muestra un modal para editar la publicación
            Swal.fire({
                title: 'Editar Publicación',
                html: `
                    <input type="text" id="edit-post-title" class="swal2-input" value="${post.title}">
                    <textarea id="edit-post-description" class="swal2-textarea">${post.description}</textarea>
                `,
                focusConfirm: false,
                preConfirm: () => {
                    const newTitle = $('#edit-post-title').val().trim();
                    const newDescription = $('#edit-post-description').val().trim();

                    // Verifica que los campos editados no estén vacíos
                    if (!newTitle || !newDescription) {
                        Swal.showValidationMessage('El título y la descripción no deben estar vacíos');
                        return false;
                    }

                    // Actualiza la publicación y renderiza las publicaciones actualizadas
                    editPost(postId, newTitle, newDescription);
                    renderPosts();
                }
            });
        })
        // Evento para eliminar una publicación
        .on('click', '.delete-post', function() {
            const postId = $(this).data('post-id');

            // Muestra una confirmación antes de eliminar la publicación
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarla'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Elimina la publicación y renderiza las publicaciones actualizadas
                    deletePost(postId);
                    renderPosts();
                }
            });
        })
        // Evento para editar un comentario
        .on('click', '.edit-comment', function() {
            const postId = $(this).data('post-id');
            const commentId = $(this).data('comment-id');
            const post = getPostById(postId);
            const comment = post.comments.find(c => c.id === commentId);

            // Muestra un modal para editar el comentario
            Swal.fire({
                title: 'Editar Comentario',
                input: 'textarea',
                inputValue: comment.text,
                showCancelButton: true,
                preConfirm: (newText) => {
                    // Verifica que el nuevo texto del comentario no esté vacío
                    if (!newText.trim()) {
                        Swal.showValidationMessage('El comentario no debe estar vacío');
                        return false;
                    }

                    // Actualiza el comentario y renderiza las publicaciones actualizadas
                    editComment(postId, commentId, newText);
                    renderPosts();
                }
            });
        })
        // Evento para eliminar un comentario
        .on('click', '.delete-comment', function() {
            const postId = $(this).data('post-id');
            const commentId = $(this).data('comment-id');

            // Muestra una confirmación antes de eliminar el comentario
            Swal.fire({
                title: '¿Estás seguro?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Elimina el comentario y renderiza las publicaciones actualizadas
                    deleteComment(postId, commentId);
                    renderPosts();
                }
            });
        });
});

// Función para renderizar las publicaciones en el DOM
function renderPosts(filteredPosts = posts) {
    const postsContainer = $('#posts-container');
    postsContainer.empty();

    // Itera sobre las publicaciones y las agrega al contenedor
    filteredPosts.forEach(post => {
        const postElement = $(`
            <div class="post">
                <h2>${post.title}</h2>
                <p>${post.description}</p>
                <small>${post.date}</small>
                <div class="actions">
                    <button class="edit-post" data-post-id="${post.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-post" data-post-id="${post.id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
                <div class="comments-section">
                    <input type="text" class="comment-input" placeholder="Escribe un comentario...">
                    <button class="add-comment" data-post-id="${post.id}">Comentar</button>
                    <div class="comments" id="comments-${post.id}"></div>
                </div>
            </div>
        `);

        // Agrega el elemento de la publicación al contenedor
        postsContainer.append(postElement);

        // Renderiza los comentarios de la publicación
        renderComments(post.id);
    });
}

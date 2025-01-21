// comments.js

// Función para agregar un nuevo comentario a una publicación específica
function addComment(postId, commentText) {
    // Verifica que el texto del comentario no esté vacío
    if (!commentText.trim()) {
        Swal.fire('Error', 'El comentario no debe estar vacío', 'error');
        return;
    }

    // Busca la publicación correspondiente por su ID
    const post = posts.find(post => post.id === postId);
    if (post) {
        // Crea un nuevo objeto de comentario con un ID único
        const newComment = {
            id: Date.now(),
            text: commentText
        };
        // Agrega el nuevo comentario al array de comentarios de la publicación
        post.comments.push(newComment);
        // Renderiza nuevamente los comentarios para reflejar el cambio
        renderComments(postId);
    }
}

// Función para editar un comentario existente
function editComment(postId, commentId, newText) {
    // Verifica que el nuevo texto del comentario no esté vacío
    if (!newText.trim()) {
        Swal.fire('Error', 'El comentario no debe estar vacío', 'error');
        return;
    }

    // Busca la publicación correspondiente por su ID
    const post = posts.find(post => post.id === postId);
    if (post) {
        // Busca el comentario específico por su ID dentro de la publicación
        const comment = post.comments.find(comment => comment.id === commentId);
        if (comment) {
            // Actualiza el texto del comentario
            comment.text = newText;
            // Renderiza nuevamente los comentarios para reflejar el cambio
            renderComments(postId);
        }
    }
}

// Función para eliminar un comentario de una publicación
function deleteComment(postId, commentId) {
    // Muestra una alerta de confirmación antes de eliminar el comentario
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Busca la publicación correspondiente por su ID
            const post = posts.find(post => post.id === postId);
            if (post) {
                // Filtra los comentarios para eliminar el comentario específico
                post.comments = post.comments.filter(comment => comment.id !== commentId);
                // Renderiza nuevamente los comentarios para reflejar el cambio
                renderComments(postId);
            }
        }
    });
}

// Función para renderizar los comentarios de una publicación en el DOM
function renderComments(postId) {
    // Selecciona el contenedor de comentarios específico de la publicación
    const commentsContainer = $(`#comments-${postId}`);
    // Limpia el contenido actual del contenedor
    commentsContainer.empty();

    // Busca la publicación correspondiente por su ID
    const post = posts.find(post => post.id === postId);
    if (post) {
        // Itera sobre cada comentario de la publicación
        post.comments.forEach(comment => {
            // Crea elementos HTML para cada comentario con botones de editar y eliminar
            const commentElement = $(`
                <div class='comment'>
                    <p>${comment.text}</p>
                    <div class='actions'>
                        <button class='edit-comment' data-post-id='${postId}' data-comment-id='${comment.id}'>
                            <i class='fas fa-edit'></i> Editar
                        </button>
                        <button class='delete-comment' data-post-id='${postId}' data-comment-id='${comment.id}'>
                            <i class='fas fa-trash-alt'></i> Eliminar
                        </button>
                    </div>
                </div>
            `);
            // Agrega el comentario al contenedor de comentarios
            commentsContainer.append(commentElement);
        });
    }
}

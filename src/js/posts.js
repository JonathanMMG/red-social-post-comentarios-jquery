// Array para almacenar las publicaciones
let posts = [];

// Función para agregar una nueva publicación
function addPost(title, description) {
    const post = {
        id: Date.now(),
        title,
        description,
        date: new Date().toLocaleDateString(),
        comments: []
    };
    posts.push(post);
    return post;
}

// Función para obtener una publicación por su ID
function getPostById(postId) {
    return posts.find(post => post.id === postId);
}

// Función para editar una publicación
function editPost(postId, newTitle, newDescription) {
    const post = getPostById(postId);
    if (post) {
        post.title = newTitle;
        post.description = newDescription;
    }
}

// Función para eliminar una publicación
function deletePost(postId) {
    posts = posts.filter(post => post.id !== postId);
}

// Función para filtrar publicaciones por palabra clave en el título
function filterPosts(keyword) {
    return posts.filter(post => post.title.toLowerCase().includes(keyword.toLowerCase()));
}

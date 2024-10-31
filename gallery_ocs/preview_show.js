var galleryItems = document.querySelectorAll('.gallery-item img');
var previewShow = document.querySelector('.preview_show');
var previewImage = document.getElementById('preview');

galleryItems.forEach(item => {
    item.addEventListener('click', function() {
        console.debug('Image clicked:', item.src);
        previewImage.src = item.src.replace('_preview', '_doc');
        previewShow.style.display = 'flex';
        console.debug('Preview shown with source:', previewImage.src);
    });
});

document.addEventListener('keydown', function(event) {
    console.debug('Key pressed:', event.key);
    if (event.key === 'Escape') {
        previewShow.style.display = 'none';
        previewImage.src = '';
        console.debug('Preview hidden');
    }
});


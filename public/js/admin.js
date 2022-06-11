const deleteElement = btn => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const currentProduct = btn.closest('article');

    fetch('/admin/product/' + prodId, {
            method: 'DELETE',
            headers: { 'csrf-token': csrf }
        }).then(result => {
            return result.json();
        })
        .then(data => {
            currentProduct.parentNode.removeChild(currentProduct);
        })
        .catch(err => {
            console.log(err);
        });
};
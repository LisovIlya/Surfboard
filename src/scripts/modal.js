const validateField = (form, fieldArray) => {

    fieldArray.forEach(field => {
        field.removeClass("form__error")
        if (field.val().trim() == "") {
            field.addClass("form__error");
        }
    });

    const errorFields = form.find(".form__error");

    return errorFields.length == 0;
}

$('.form').submit(e => {
    e.preventDefault();

    const form = $(e.currentTarget);
    const name = form.find("[name='name']");
    const phone = form.find("[name='phone']");
    const comment = form.find("[name='comment']");
    const to = form.find("[name='to']");

    const modal = $("#modal");
    const content = modal.find(".modal__content");

    modal.removeClass("error__modal");

    const isValid = validateField(form, [name, phone, comment, to]);

    if (isValid) {
        document.body.classList.add('locked');
        const request = $.ajax({
            url: "https://webdev-api.loftschool.com/sendmail",
            method: "post",
            data: {
                name: name.val(),
                phone: phone.val(),
                comment: comment.val(),
                to: to.val(),
            },
        });

        request.done((data) => {
            content.text(data.message);
        });

        request.fail(data => {
            const message = data.responseJSON.message;
            content.text(message);
            modal.addClass("error__modal");
        });

        request.always(() => {
            $.fancybox.open({
                src: "#modal",
                type: "inline"
            });
        });
    }
});

$('.app-close-modal').click(e => {
    e.preventDefault();

    document.body.classList.remove('locked');

    $.fancybox.close();
})
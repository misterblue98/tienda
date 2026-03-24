const mp = new MercadoPago("APP_USR-9235c438-7dc2-483e-86d9-c851898a3ea0", {
    locale: "es-CL"
});

fetch("https://6a5f-179-4-172-127.ngrok-free.app/crear-preferencia")
.then(response => response.json())
.then(data => {

    const bricksBuilder = mp.bricks();

    bricksBuilder.create("wallet", "wallet_container", {
        initialization: {
            preferenceId: data.id
        }
    });

})
.catch(error => console.log(error));

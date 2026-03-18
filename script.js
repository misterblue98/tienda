const mp = new MercadoPago("APP_USR-9235c438-7dc2-483e-86d9-c851898a3ea0");

fetch("http://127.0.0.1:5000/crear-preferencia")
  .then(response => response.json())
  .then(data => {

    mp.bricks().create("wallet", "wallet_container", {
      initialization: {
        preferenceId: data.id
      }
    });

  })
  .catch(error => console.log(error));

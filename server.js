import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// COLOQUE SEU TOKEN AQUI
const MP_TOKEN = "COLE_SEU_ACCESS_TOKEN_AQUI";

// Criar pagamento
app.post("/criar-pagamento", async (req, res) => {
  const { email } = req.body;

  const pagamento = {
    items: [
      {
        title: "Acesso ao Curso",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 20
      }
    ],
    payer: {
      email: email
    }
  };

  const resposta = await fetch(
    "https://api.mercadopago.com/checkout/preferences",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pagamento)
    }
  );

  const dados = await resposta.json();

  res.json({
    link: dados.init_point
  });
});

// Webhook (confirma pagamento)
app.post("/webhook", (req, res) => {
  console.log("Pagamento recebido:", req.body);

  // Aqui depois você libera o aluno

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("API Mercado Pago OK ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta " + PORT);
});

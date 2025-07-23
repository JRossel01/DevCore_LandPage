// netlify/functions/chat.js

// Usamos CommonJS require
const OpenAI = require("openai");

// Instanciamos el cliente con tu clave de entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async (event, context) => {
  try {
    const { message, history } = JSON.parse(event.body);

    const systemPrompt = `
      Eres el asistente de DevCore.
      Empresa fundada por Rodrigo Centellas y Jorge Rossel.
      Ofreces monitoreo de flotas con IA: reconocimiento facial, detección de somnolencia, alertas de velocidad e informes.
      Precios: Básico $29/m (10 vehículos), Pro $59/m (50 vehículos), Enterprise $99/m (ilimitado).
      Contacto: +591 9989028, devCoreContact01@gmail.com.
    `;

    // Monta el array de mensajes
    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message }
    ];

    // Llamada a la API de chat
    const response = await openai.chat.completions.create({
      model: "o4-mini",
      messages,
      temperature: 1
    });

    const reply = response.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (error) {
    console.error("Chat function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal error" })
    };
  }
};

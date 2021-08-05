import { SiteClient } from "datocms-client";

export default async function recebedorDeRequest(request,response) {
	if (request.method === "POST") {
		const TOKEN = "d05a54260f6ea775a30402da1d3d59";

		const client = new SiteClient(TOKEN);

		const registroCriado = await client.items.create({
			itemType: "1049785",
			...request.body,
		});
		console.log(registroCriado);

		response.json({
			dados: "kkkkk",
			registroCriado: registroCriado,
		});
		return;
	}

	response.status(404).json({
		message: "Ainda não temos nada no GET, mas no POST tem!"
	});
}
import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import {
	AlurakutMenu,
	AlurakutProfileSidebarMenuDefault,
	OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

const ProfileSidebar = (props) => {
	return (
		<Box as="aside" >
			<img src={`https://github.com/${props.githubUser}.png`} Style={{ borderRadius: '8px'}}/>

			<hr />

			<p>
				<a className="boxLink" htef={`https://github.com/${props.githubUser}`}>
					@{props.githubUser}
				</a>
			</p>

			<hr />
			<AlurakutProfileSidebarMenuDefault />
		</Box>
	);
};

function ProfileRelationsBox(props) {
	return (
		<ProfileRelationsBoxWrapper>
			<h2 className="smallTitle">{props.title} ({props.items.length})</h2>

			<ul>
				{/*{seguidores.map((item) => {
					return (
						<li key={item}>
							<a href={`https://github.com/${item}.png`}>
								<img src={item.img} />
								<span>{item.title}</span>
							</a>
						</li>
					);
				})}*/}
			</ul>
		</ProfileRelationsBoxWrapper>
	);
}

export default function Home(props) {
	const usuarioAleatorio = props.githubUser;
	const [ comunidades, setComunidades ] = React.useState([]);
	const pessoasFavoritas = [
		"juunegreiros",
		"omariosouto",
		"peas",
		"rafaballerini",
		"marcobrunodev",
		"felipefialho",
	];

	const [seguidores, setSeguidores] = React.useState([]);

	React.useEffect( function () {
		//GET
		fetch(`https://api.github.com/users/${usuarioAleatorio}/followers`)
			.then(function (respostaDoServidor) {
				return respostaDoServidor.json();
			})
			.then(function (respostaCompleta) {
				setSeguidores(respostaCompleta);
			})
		
		//API GraphQL Dato
		fetch("https://graphql.datocms.com/", {
			method: "POST",
			headers: {
				"Authorization": 'd83ec735a9cfd7a8b27241deffb525',
				"Content-Type": 'application/json',
				"Accept": 'application/json',
			},
			body: JSON.stringify({ "query": `query { 
				allCommunities {
					id
					title
					imageUrl 
					creatorSlug
				}
			}`})
		})
		.then((response) => response.json())
		.then((respostaCompleta) => {
			const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;

			setComunidades(comunidadesVindasDoDato);
		})
	}, []);

	return (
		<>
			<AlurakutMenu />

			<MainGrid>
				<div className="profileArea" style={{ gridArea: "profileArea" }}>
					<ProfileSidebar githubUser={usuarioAleatorio} />
				</div>

				<div className="WelcomeArea" style={{ gridArea: "welcomeArea" }}>
					<Box>
						<h1 className="title">Bem vindo(a)</h1>

						<OrkutNostalgicIconSet />
					</Box>

					<Box>
						<h2 className="subTitle">O que você deseja fazer?</h2>
						<form
							onSubmit={function handleCriaComunidade(event) {
								event.preventDefault();

								const dadosForm = new FormData(event.target);

								const comunidade = {
									title: dadosForm.get("title"),
									imgageUrl: dadosForm.get("image"),
									creatorSlug: usuarioAleatorio,
								};

								fetch('/api/comunidades', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify(comunidade),
								})
								.then(async (response) => {
									const dados = await response.json();
									const comunidade = dados.registroCriado;
									const comunidadesAtualizadas = [...comunidades, comunidade];
									setComunidades(comunidadesAtualizadas);
								})

							}}
						>
							<div>
								<input
									placeholder="Qual vai ser o nome da sua comunidade?"
									name="title"
									aria-label="Qual vai ser o nome da sua comunidade?"
									type="text"
								/>
							</div>
							<div>
								<input
									placeholder="Coloque uma URL para usar de capa"
									name="image"
									aria-label="Coloque uma URL para usar de capa"
								/>
							</div>

							<button>Criar comunidade</button>
						</form>
					</Box>
				</div>

				<div
					className="profileRelationsArea"
					style={{ gridArea: "profileRelationsArea" }}
				>
					<ProfileRelationsBox title='Seguidores' items={seguidores} />

					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Comunidades ({comunidades.length})
						</h2>

						<ul>
							{comunidades.slice(0,6).map((item) => {
								return (
									<li key={item.id}>
										<a href={`/comunidades/${item.id}`}>
											<img src={item.imageUrl} />
											<span>{item.title}</span>
										</a>
									</li>
								);
							})}
						</ul>
					</ProfileRelationsBoxWrapper>

					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Pessoas Favoritas ({pessoasFavoritas.length})
						</h2>
						<ul>
							{pessoasFavoritas.slice(0,6).map((item) => {
								return (
									<li key={item}>
										<a href={`/users/${item}`}>
											<img src={`https://github.com/${item}.png`} />
											<span>{item}</span>
										</a>
									</li>
								);
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
				</div>
			</MainGrid>
		</>
	);
}


export async function getServerSideProps(ctx) {
	const cookies = nookies.get(ctx);
	const token = cookies.USER_TOKEN;
	const decodedToken = jwt.decode(token);
	const githubUser = decodedToken?.githubUser;

	if (!githubUser) {
		return {
			redirect: {
				destination: "/login",
				permanent: false,
			},
		};
	}

	return {
		props: {
			githubUser,
		},
	};
}
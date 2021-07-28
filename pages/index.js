import MainGrid from '../src/components/MainGrid'
import Box from "../src/components/Box"
import { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

const ProfileSidebar = (props) => {

  return (
		<Box>
			<img src={ `https://github.com/${props.githubUser}.png` }/>
		</Box>
	);
};


export default function Home() {
  const githubUser = "jpablodavid";
  const pessoasFavoritas = [
    'juunegreiros',
    'omariosouto', 
    'peas', 
    'rafaballerini', 
    'marcobrunodev',
    'felipefialho'
  ]

  return (
		<>
			<AlurakutMenu />

			<MainGrid>
				<div className="profileArea" style={{ gridArea: "profileArea" }}>
					<ProfileSidebar githubUser={githubUser} />
				</div>

				<div className="WelcomeArea" style={{ gridArea: "welcomeArea" }}>
					<Box>
						<h1 className='title' >Bem vindo(a)</h1>
					</Box>

          <OrkutNostalgicIconSet/>
				</div>

				<div
					className="profileRelationsArea"
					style={{ gridArea: "profileRelationsArea" }}
				>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Pessoas Favoritas ({pessoasFavoritas.length})
						</h2>
						<ul>
							{pessoasFavoritas.map((item) => {
								return (
									<a href={`https://github.com/${item}`} key={item}>
										<img src={`https://github.com/${item}.png`} />
										<span>{item}</span>
									</a>
								);
							})}
						</ul>
					</ProfileRelationsBoxWrapper>

					<Box>Comunidades</Box>
				</div>
			</MainGrid>
		</>
	);
}

import { BriefcaseBusiness, CalendarClock, FileArchive, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, PageHeader } from '../components/ui'

const cards = [
  {
    to: '/funcionarios',
    title: 'Funcionários',
    description: 'Consulte a equipe ativa, dados cadastrais e situação dos colaboradores.',
    action: 'Ver equipe',
    icon: UsersRound,
  },
  {
    to: '/registro-funcionario',
    title: 'Registro de funcionário',
    description: 'Cadastre novos colaboradores ou atualize registros existentes.',
    action: 'Abrir registros',
    icon: BriefcaseBusiness,
  },
  {
    to: '/ponto',
    title: 'Folhas de ponto e recibos',
    description: 'Revise marcações mensais e acesse geração, impressão e reimpressão dos documentos.',
    action: 'Abrir central mensal',
    icon: CalendarClock,
    featured: true,
  },
  {
    to: '/rh/modelos',
    title: 'Modelos de documentos',
    description: 'Gerencie os modelos usados nos documentos do RH.',
    action: 'Ver modelos',
    icon: FileArchive,
  },
]

export default function RhHubPage() {
  return <>
    <PageHeader title="RH" description="Gestão dos colaboradores, registros, folhas de ponto e documentos trabalhistas."/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:14}}>
      {cards.map(({to,title,description,action,icon:Icon,featured}) => <Link key={to} to={to} style={{textDecoration:'none',color:'inherit',gridColumn:featured?'1 / -1':undefined}}>
        <Card className={featured?'rh-hub-card rh-hub-card-featured':'rh-hub-card'} style={{height:'100%',padding:20,cursor:'pointer'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16}}>
            <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{width:42,height:42,borderRadius:10,display:'grid',placeItems:'center',background:'rgba(74,151,255,.12)',flex:'0 0 auto'}}><Icon size={20}/></div>
              <div><h2 style={{margin:'0 0 7px',fontSize:18}}>{title}</h2><p style={{margin:0,maxWidth:680}}>{description}</p></div>
            </div>
            <strong style={{whiteSpace:'nowrap',fontSize:13}}>{action} →</strong>
          </div>
        </Card>
      </Link>)}
    </div>
  </>
}

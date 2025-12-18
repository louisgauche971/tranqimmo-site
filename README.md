# Tranqimmo — MVP interactif (Var)

Prototype interactif pour tester Tranqimmo avec des professionnels du bâtiment dans le Var (83).

## Pages
- Accueil : /#/ 
- Déposer une demande : /#/demande
- Espace Pro : /#/pro
- Mode test : /#/aide

## Fonctionnement
- Les demandes créées sur /#/demande apparaissent dans /#/pro
- Pipeline + changement de statut + notes internes
- Données stockées en local (localStorage) : pas de backend

## Déploiement Vercel
- Uploade sur GitHub puis Vercel → New Project → Deploy


## Multi-utilisateurs (actualisation en temps réel) — Supabase (gratuit)
Ce MVP est en local par défaut. Pour que plusieurs utilisateurs voient les mêmes demandes en direct :

1) Crée un projet sur Supabase
2) SQL (table `leads`) :

```sql
create table if not exists public.leads (
  id text primary key,
  created_at timestamptz not null default now(),
  stage text not null,
  work_type text not null,
  budget text not null,
  timeframe text not null,
  city text not null,
  postal text not null,
  address_hint text,
  description text,
  name text,
  phone text,
  email text,
  photos text,
  notes text
);

alter table public.leads enable row level security;

create policy "public read" on public.leads
for select using (true);

create policy "public insert" on public.leads
for insert with check (true);

create policy "public update" on public.leads
for update using (true) with check (true);
```

3) Dans `app.js`, renseigne :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Ensuite, les demandes se synchronisent et s’actualisent entre plusieurs utilisateurs.

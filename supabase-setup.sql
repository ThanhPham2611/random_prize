create table if not exists public.app_config (
  id integer primary key,
  win_rate numeric(5,4) not null check (win_rate >= 0 and win_rate <= 1),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.app_config (id, win_rate)
values (1, 0.4000)
on conflict (id) do nothing;

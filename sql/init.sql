create table mail_template
(
    id          serial                  not null
        constraint mail_template_pk
            primary key,
    type        varchar(100)            not null,
    name        varchar(200)            not null,
    description varchar(300),
    subject     text                    not null,
    content     text                    not null,
    created_at  timestamp default now() not null,
    updated_at  timestamp default now() not null
);

create table notification_history
(
    id          serial                  not null
        constraint notification_history_pk
            primary key,
    to_value        varchar(100)            not null,
    type        varchar(100)            not null,
    reference_id        integer,
    status        varchar(50),
    content     text                    not null,
    log     varchar(200),
    request     json,
    created_at  timestamp default now() not null,
    updated_at  timestamp default now() not null
);


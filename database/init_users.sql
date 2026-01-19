--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Postgres.app)
-- Dumped by pg_dump version 17.0

-- Started on 2026-01-20 01:57:38 +03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16429)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    username character varying(30),
    email character varying(254) NOT NULL,
    password character varying(254) NOT NULL,
    id integer NOT NULL,
    role text DEFAULT 'user'::text,
    "refreshToken" text,
    "refreshTokenExpiryTime" timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16438)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3681 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3523 (class 2604 OID 16439)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3674 (class 0 OID 16429)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (username, email, password, id, role, "refreshToken", "refreshTokenExpiryTime") FROM stdin;
yakup	yakup@gmail.com	SGaJ4hvl4uFiR2sH4H6n2Q8APK5bJEUvDQbd3c0WGZ/v4QhjmJhj6PSgFON/lEb/	22	user	\N	\N
alice01	alice01@example.com	JFi3gkATP/NB51jZo+OpGi3b9X5sMf0k029lXBgc6a/uZ916JAg0XIGP4jHzggwQ	23	user	\N	\N
bob02	bob02@example.com	76MNry+fI9CsdUKXMWKvlQAHvgamED8tjbkHR3UtRPPGgsuk1AHjzTHuuXSBtWZh	24	user	\N	\N
charlie03	charlie03@example.com	8Fq17Lozv+LwGCkGq/CZ3TqIThtll1wVdOQ4qwSFovC/SX2oAO5jtHN3zPzen9An	25	user	\N	\N
dave04	dave04@example.com	5V+zuLGIrZzxxrDPqp9rmlrBF5aWba0aCSK8VkmUu0EJASPrDouTtZ+VHVX5JS0i	26	user	\N	\N
eve05	eve05@example.com	JcpBVBSfhmZaroiD0kwHS2SqNCQAJvqmHZiQsbQHT2Yb2ul2QazQiRi+aVRTz0am	27	user	\N	\N
frank06	frank06@example.com	6AcpDececd1ABxzGJzS2h0MeTL1PI8oQUiKU2Axu4r9e0CwjHrixx00KiAfMTB90	28	user	\N	\N
grace07	grace07@example.com	V1K+7thfS9gRJ1sYThfx+DLq2rXu/szAyFynE5s0VAkjfxPjfORKXnrOy2TlodJP	29	user	\N	\N
heidi08	heidi08@example.com	DY18XAgcZudD88tc06p5nDC5R5yeJ4uXc/JmB5G0CZ/7ZlduLg1Lb/QbSrv+7AJI	30	user	\N	\N
ivan09	ivan09@example.com	PK37yLneswgj1rhTtoqxipqFjQZWDMdvkq0A1ZAephW4haGKvwM+n8AHQ2u9f62q	31	user	\N	\N
judy10	judy10@example.com	SqM9pssyVH4inU0cnSg6Dc4lWksnw7diOwysp9jgeF1NplpJiYs9HIJp0tqsE+BA	32	user	\N	\N
melih	melihbal@gmail.com	ST7D+RNV0Vgxp7WAG4HvJU0OjfJ0ceS4hZdtPyAx23LLkne+Y4LlqYq1ExD1y/tV	33	user	\N	\N
semih	semihdizman@gmail.com	Tzgm64q/nosXBbDWwNJ9/rCKjxfazAg2tSWNFvq2hSZPIK4s5Xf4awXM5nIlCBwM	37	user	\N	\N
yaren	yarenakturk@gmail.com	3aMY3A2DBK2a4p01paeSzxg6nxQLrcVd8ApX6fKtTNinbsCbZ7CYhuaH9jJytz+g	38	user	\N	\N
serra	serraozbay@gmail.com	S6h7AE6oaMre+HRIxA8ZAYKqs5i/NgPCJvuXTeUQtXBcAFuDTfCPVcOYIpnWXp6n	39	user	\N	\N
kursat	kursat@gmail.com	x5ZaNf6m7JtMDJgmFE8xOvSKbomLrZdrFsLqf92SMBZzWeqIwjhlP+BNHrzMrVxa	41	user	\N	\N
mert	mertozu@gmail.com	rahA08m94YrEoooMNrjiE887m/ILa1lQiDEa1BhN8e8zpfJHcxHASnx2Rtk1zs8L	35	user	\N	\N
emine	emineturk@gmail.com	cZzZR5Gp9guhIhl6Q0EZSQyfldETCZC+DE+hMPckBuP6uXqVTbJc6IRRtgTEZC/n	36	user	\N	\N
admin	admin@demo.com	IalEnG1JRllgCR+t/ZBkqoItJXwKz9XNfQRvZwfFPGDVUAjopl5ketg+AlYc4PpB	42	admin	\N	\N
elif	elifelif@gmail.com	nFNy80H0qiQsdR4YERNoTRfhU3oPtdzYfgMnxQ9/r/D9R/8CZzS6Iot+ZOy9bTCI	40	admin	\N	\N
user	user@demo.com	kLSxVWb4djQ25mNWheww7DTT2WZP1r09sbYW1Lrb34suHcpSPfGLqZ4kkVm8GhZt	43	user	\N	\N
\.


--
-- TOC entry 3682 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 43, true);


--
-- TOC entry 3526 (class 2606 OID 16433)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3528 (class 2606 OID 16441)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2026-01-20 01:57:38 +03

--
-- PostgreSQL database dump complete
--


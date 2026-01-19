--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Postgres.app)
-- Dumped by pg_dump version 17.0

-- Started on 2026-01-20 01:57:57 +03

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
-- TOC entry 217 (class 1259 OID 16401)
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    aracid integer NOT NULL,
    aracplaka character varying(20),
    veritarihi date,
    hiz integer,
    kmsayaci double precision
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- TOC entry 3668 (class 0 OID 16401)
-- Dependencies: 217
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (aracid, aracplaka, veritarihi, hiz, kmsayaci) FROM stdin;
3	41 KT 593	2024-07-09	75	196210.11
2	34 EGB 248	2024-07-09	133	45711.15
1	34 RN 5944	2024-07-10	115	89105.03
3	41 KT 593	2024-07-10	67	197105.71
5	35 TH 342	2025-07-24	129	111111
2	34 EGB 248	2024-07-11	110	46105.86
4	35 MLH 000	2025-07-18	111	99812.1015625
7	41 SLN 061	2025-08-01	121	121000
2	34 EGB 248	2024-07-10	155	45091.890625
3	41 KT 593	2024-07-08	112	193982.1
2	34 EGB 248	2024-07-08	72	44000.1
7	41 SLN 061	2025-07-30	125	120000
6	35 MB 123	2025-07-23	111	110000
1	34 RN 5944	2024-07-08	144	88605.9375
1	34 RN 5944	2024-07-09	114	88905.40625
4	35 MLH 000	2025-07-30	120	100000
5	35 TH 342	2025-07-30	110	129000
\.


-- Completed on 2026-01-20 01:57:57 +03

--
-- PostgreSQL database dump complete
--


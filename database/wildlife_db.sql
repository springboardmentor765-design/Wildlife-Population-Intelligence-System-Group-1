--
-- PostgreSQL database dump
--

\restrict 1EglpNiPvQA3YAyJNHbuIQ2P2bjt9JGVorpz0GuhXBZuHsmvZG2RFeDhjKzLbfb

-- Dumped from database version 18.4 (Homebrew)
-- Dumped by pg_dump version 18.4 (Homebrew)

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audio_predictions; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.audio_predictions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    inference_run_id uuid NOT NULL,
    species_id bigint,
    class_id integer,
    confidence double precision NOT NULL,
    probabilities jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT audio_predictions_confidence_check CHECK (((confidence >= (0)::double precision) AND (confidence <= (1)::double precision)))
);


ALTER TABLE public.audio_predictions OWNER TO wildlife_app;

--
-- Name: identified_animals; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.identified_animals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    animal_code text NOT NULL,
    species_id bigint NOT NULL,
    first_seen_media_id uuid,
    embedding bytea,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    last_seen_at timestamp with time zone
);


ALTER TABLE public.identified_animals OWNER TO wildlife_app;

--
-- Name: image_detections; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.image_detections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    inference_run_id uuid NOT NULL,
    species_id bigint,
    class_id integer,
    confidence double precision NOT NULL,
    x1 double precision,
    y1 double precision,
    x2 double precision,
    y2 double precision,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT image_detections_confidence_check CHECK (((confidence >= (0)::double precision) AND (confidence <= (1)::double precision)))
);


ALTER TABLE public.image_detections OWNER TO wildlife_app;

--
-- Name: inference_runs; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.inference_runs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    media_id uuid NOT NULL,
    model_version_id uuid,
    status text DEFAULT 'completed'::text NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    error_message text,
    raw_response jsonb DEFAULT '{}'::jsonb NOT NULL,
    CONSTRAINT inference_runs_status_check CHECK ((status = ANY (ARRAY['queued'::text, 'processing'::text, 'completed'::text, 'failed'::text])))
);


ALTER TABLE public.inference_runs OWNER TO wildlife_app;

--
-- Name: media_assets; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.media_assets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    media_type text NOT NULL,
    original_filename text NOT NULL,
    storage_path text NOT NULL,
    mime_type text,
    file_size_bytes bigint,
    sha256 text,
    uploaded_by uuid,
    captured_at timestamp with time zone,
    latitude double precision,
    longitude double precision,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT media_assets_media_type_check CHECK ((media_type = ANY (ARRAY['image'::text, 'audio'::text])))
);


ALTER TABLE public.media_assets OWNER TO wildlife_app;

--
-- Name: species; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.species (
    id bigint NOT NULL,
    name text NOT NULL,
    scientific_name text,
    image_class_id integer,
    audio_class_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.species OWNER TO wildlife_app;

--
-- Name: image_detection_results; Type: VIEW; Schema: public; Owner: wildlife_app
--

CREATE VIEW public.image_detection_results AS
 SELECT ir.id AS inference_run_id,
    ma.id AS media_id,
    ma.original_filename,
    s.name AS species,
    d.class_id,
    d.confidence,
    d.x1,
    d.y1,
    d.x2,
    d.y2,
    ir.started_at
   FROM (((public.image_detections d
     JOIN public.inference_runs ir ON ((ir.id = d.inference_run_id)))
     JOIN public.media_assets ma ON ((ma.id = ir.media_id)))
     LEFT JOIN public.species s ON ((s.id = d.species_id)));


ALTER VIEW public.image_detection_results OWNER TO wildlife_app;

--
-- Name: model_versions; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.model_versions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    model_type text NOT NULL,
    version text NOT NULL,
    file_path text,
    framework text,
    metrics jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT model_versions_model_type_check CHECK ((model_type = ANY (ARRAY['image_detection'::text, 'audio_classification'::text, 're_identification'::text])))
);


ALTER TABLE public.model_versions OWNER TO wildlife_app;

--
-- Name: reidentifications; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.reidentifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    inference_run_id uuid NOT NULL,
    animal_id uuid,
    species_id bigint,
    status text NOT NULL,
    similarity double precision,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reidentifications_status_check CHECK ((status = ANY (ARRAY['new_animal'::text, 'already_seen'::text])))
);


ALTER TABLE public.reidentifications OWNER TO wildlife_app;

--
-- Name: species_id_seq; Type: SEQUENCE; Schema: public; Owner: wildlife_app
--

CREATE SEQUENCE public.species_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.species_id_seq OWNER TO wildlife_app;

--
-- Name: species_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: wildlife_app
--

ALTER SEQUENCE public.species_id_seq OWNED BY public.species.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: wildlife_app
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    role text DEFAULT 'researcher'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['researcher'::text, 'conservation_officer'::text, 'forest_department_officer'::text, 'administrator'::text])))
);


ALTER TABLE public.users OWNER TO wildlife_app;

--
-- Name: species id; Type: DEFAULT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.species ALTER COLUMN id SET DEFAULT nextval('public.species_id_seq'::regclass);


--
-- Data for Name: audio_predictions; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.audio_predictions (id, inference_run_id, species_id, class_id, confidence, probabilities, created_at) FROM stdin;
f867b336-e981-4d25-a89a-edfcf55ab136	2b3eb3f3-50cf-4d7f-aee5-9da35318dd59	2	\N	0.9999	{"lion": 0.9999}	2026-08-11 14:16:56.770876+05:30
17db4df5-27d5-499a-b402-6aabd5d86562	09c50730-d808-4628-9056-358c6bb30a04	2	8	0.9999	{"lion": 0.9999}	2026-08-11 15:06:36.880965+05:30
783a66c8-f061-405a-95c9-e318ee4c34cf	7e2ad0b5-f78b-4367-9401-5546acc527ba	2	8	0.9999	{"lion": 0.9999}	2026-08-11 17:51:42.121571+05:30
8ccb0f4a-655c-4b08-89da-30f237cdcfb7	43435a72-c1a1-4ad1-83b7-5393f96b7bd6	18	5	0.9997	{"elephant": 0.9997}	2026-08-12 00:06:11.289655+05:30
\.


--
-- Data for Name: identified_animals; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.identified_animals (id, animal_code, species_id, first_seen_media_id, embedding, created_at, last_seen_at) FROM stdin;
\.


--
-- Data for Name: image_detections; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.image_detections (id, inference_run_id, species_id, class_id, confidence, x1, y1, x2, y2, created_at) FROM stdin;
8ed26044-8328-4f6b-ab0d-765fc6db7397	cee81f41-23f6-4d0a-a5f5-ec0293a9a12c	2	1	0.9324	0.1	22.56	421.08	408	2026-08-11 10:01:43.74206+05:30
66126213-15d6-4574-b390-6afc3c07ecc4	897f0999-bbd0-4c36-b2c2-f74f1f2b5cd5	32	31	0.5416	67.74	13.82	229.09	315.83	2026-08-11 11:04:54.691444+05:30
05e00f8c-0d23-4f59-a09d-27040ad89e41	897f0999-bbd0-4c36-b2c2-f74f1f2b5cd5	38	37	0.3238	416.09	190.48	529.5	340.19	2026-08-11 11:04:54.691444+05:30
6d0269b0-9bd3-4e07-8cba-9eec144dbd14	897f0999-bbd0-4c36-b2c2-f74f1f2b5cd5	5	4	0.3062	311.68	230.19	442.11	339.84	2026-08-11 11:04:54.691444+05:30
8e7c7c3a-6f3a-4ed9-ba35-7edb5b5632f6	b9f2eb15-ac16-48a5-8fe2-47525199f38a	2	1	0.9324	0.1	22.56	421.08	408	2026-08-11 17:50:42.582374+05:30
591ff97f-021a-4e13-9981-87d38470e853	94acea96-c0a6-4d6d-9b10-4e0c3ccb1832	1	0	0.9045	81.46	183.78	295.48	487.77	2026-08-11 18:07:52.529677+05:30
fe17fa3e-3f04-4d9f-881b-398690dbface	94acea96-c0a6-4d6d-9b10-4e0c3ccb1832	1	0	0.7176	0.67	175.57	46.24	217.31	2026-08-11 18:07:52.529677+05:30
83bd8e29-fa00-4ea0-82bb-5db0d760bde7	0b51a92a-224c-47a3-955b-4a3551e15776	1	0	0.9045	81.46	183.78	295.48	487.77	2026-08-11 22:35:32.030581+05:30
79e58254-1e9b-4cc0-b848-bf8d13cfa03b	0b51a92a-224c-47a3-955b-4a3551e15776	1	0	0.7176	0.67	175.57	46.24	217.31	2026-08-11 22:35:32.030581+05:30
1fb3cb1f-c981-4147-a171-f3a34d07157c	65c0ec61-2e36-4498-9b33-8c87b43677b9	32	31	0.8642	107.19	37.03	322.79	419.38	2026-08-11 22:44:07.066278+05:30
2d648949-3846-4405-9d90-460fe3c706de	7cde388a-a8a8-48a5-89f2-3c047a6b24ee	18	17	0.9467	82.9	44.87	501.25	336.23	2026-08-11 23:46:14.587943+05:30
df4cc93b-29bf-492b-9c06-e7c75f3555d0	46618ace-a867-40a5-9ff2-8ddd30b842da	32	31	0.5416	67.74	13.82	229.09	315.83	2026-08-11 23:55:14.692407+05:30
2aba7c15-a02f-4b85-a7d4-4b1c58213fa7	46618ace-a867-40a5-9ff2-8ddd30b842da	38	37	0.3238	416.09	190.48	529.5	340.19	2026-08-11 23:55:14.692407+05:30
a01ca988-d539-4cbb-af66-6558adfac4a6	46618ace-a867-40a5-9ff2-8ddd30b842da	5	4	0.3062	311.68	230.19	442.11	339.84	2026-08-11 23:55:14.692407+05:30
d31f22a6-0355-470b-9125-d9e5fcff9430	e1052ea7-e778-4644-b172-4334772b4493	32	31	0.9147	93.6	22.46	1422.19	1593.5	2026-08-12 00:24:10.772285+05:30
\.


--
-- Data for Name: inference_runs; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.inference_runs (id, media_id, model_version_id, status, started_at, completed_at, error_message, raw_response) FROM stdin;
cee81f41-23f6-4d0a-a5f5-ec0293a9a12c	4dbc39e4-a484-4e30-8e48-87b27bf48c0c	\N	completed	2026-08-11 10:01:43.74206+05:30	2026-08-11 10:01:43.741959+05:30	\N	[{"bbox": {"x1": 0.1, "x2": 421.08, "y1": 22.56, "y2": 408.0}, "animal": "Lion", "class_id": 1, "confidence": 0.9324}]
897f0999-bbd0-4c36-b2c2-f74f1f2b5cd5	19a57143-f5f2-4f48-8471-68a9d8e09323	\N	completed	2026-08-11 11:04:54.691444+05:30	2026-08-11 11:04:54.691344+05:30	\N	[{"bbox": {"x1": 67.74, "x2": 229.09, "y1": 13.82, "y2": 315.83}, "animal": "Giraffe", "class_id": 31, "confidence": 0.5416}, {"bbox": {"x1": 416.09, "x2": 529.5, "y1": 190.48, "y2": 340.19}, "animal": "Rhinoceros", "class_id": 37, "confidence": 0.3238}, {"bbox": {"x1": 311.68, "x2": 442.11, "y1": 230.19, "y2": 339.84}, "animal": "Tiger", "class_id": 4, "confidence": 0.3062}]
2b3eb3f3-50cf-4d7f-aee5-9da35318dd59	32172f81-eadb-4799-aee1-533b9f4e7054	\N	completed	2026-08-11 14:16:56.770876+05:30	2026-08-11 14:16:56.770705+05:30	\N	{"animal": "lion", "confidence": 0.9999}
09c50730-d808-4628-9056-358c6bb30a04	db9d9b39-f334-400a-96e4-bf53b6d9b14b	\N	completed	2026-08-11 15:06:36.880965+05:30	2026-08-11 15:06:36.880831+05:30	\N	{"animal": "lion", "class_id": 8, "confidence": 0.9999}
b9f2eb15-ac16-48a5-8fe2-47525199f38a	daf6a510-d977-47c2-bb4c-e618e037b1e3	\N	completed	2026-08-11 17:50:42.582374+05:30	2026-08-11 17:50:42.5823+05:30	\N	[{"bbox": {"x1": 0.1, "x2": 421.08, "y1": 22.56, "y2": 408.0}, "animal": "Lion", "class_id": 1, "confidence": 0.9324}]
7e2ad0b5-f78b-4367-9401-5546acc527ba	014247bc-b4ae-41bb-8b55-92cc7e5e7c81	\N	completed	2026-08-11 17:51:42.121571+05:30	2026-08-11 17:51:42.12136+05:30	\N	{"animal": "lion", "class_id": 8, "confidence": 0.9999}
94acea96-c0a6-4d6d-9b10-4e0c3ccb1832	6f89587f-8580-443f-b79d-2471adfd9f10	\N	completed	2026-08-11 18:07:52.529677+05:30	2026-08-11 18:07:52.529602+05:30	\N	[{"bbox": {"x1": 81.46, "x2": 295.48, "y1": 183.78, "y2": 487.77}, "animal": "Zebra", "class_id": 0, "confidence": 0.9045}, {"bbox": {"x1": 0.67, "x2": 46.24, "y1": 175.57, "y2": 217.31}, "animal": "Zebra", "class_id": 0, "confidence": 0.7176}]
0b51a92a-224c-47a3-955b-4a3551e15776	bbeecb71-6dfb-4449-b6ad-235c677ea13e	\N	completed	2026-08-11 22:35:32.030581+05:30	2026-08-11 22:35:32.030514+05:30	\N	[{"bbox": {"x1": 81.46, "x2": 295.48, "y1": 183.78, "y2": 487.77}, "animal": "Zebra", "class_id": 0, "confidence": 0.9045}, {"bbox": {"x1": 0.67, "x2": 46.24, "y1": 175.57, "y2": 217.31}, "animal": "Zebra", "class_id": 0, "confidence": 0.7176}]
65c0ec61-2e36-4498-9b33-8c87b43677b9	c3dcade5-2289-4bac-a90a-37ccd391e178	\N	completed	2026-08-11 22:44:07.066278+05:30	2026-08-11 22:44:07.066187+05:30	\N	[{"bbox": {"x1": 107.19, "x2": 322.79, "y1": 37.03, "y2": 419.38}, "animal": "Giraffe", "class_id": 31, "confidence": 0.8642}]
7cde388a-a8a8-48a5-89f2-3c047a6b24ee	1b677064-30db-45f0-ba30-c064014668ad	\N	completed	2026-08-11 23:46:14.587943+05:30	2026-08-11 23:46:14.587864+05:30	\N	[{"bbox": {"x1": 82.9, "x2": 501.25, "y1": 44.87, "y2": 336.23}, "animal": "Elephant", "class_id": 17, "confidence": 0.9467}]
46618ace-a867-40a5-9ff2-8ddd30b842da	cd1b5361-4f8c-4c80-a59e-66e190ff5540	\N	completed	2026-08-11 23:55:14.692407+05:30	2026-08-11 23:55:14.692315+05:30	\N	[{"bbox": {"x1": 67.74, "x2": 229.09, "y1": 13.82, "y2": 315.83}, "animal": "Giraffe", "class_id": 31, "confidence": 0.5416}, {"bbox": {"x1": 416.09, "x2": 529.5, "y1": 190.48, "y2": 340.19}, "animal": "Rhinoceros", "class_id": 37, "confidence": 0.3238}, {"bbox": {"x1": 311.68, "x2": 442.11, "y1": 230.19, "y2": 339.84}, "animal": "Tiger", "class_id": 4, "confidence": 0.3062}]
43435a72-c1a1-4ad1-83b7-5393f96b7bd6	a8f67461-8f99-40f4-a477-bdc2d1e6e942	\N	completed	2026-08-12 00:06:11.289655+05:30	2026-08-12 00:06:11.288836+05:30	\N	{"animal": "elephant", "class_id": 5, "duration": 9.587, "waveform": [0.0, 0.00008027716619680459, 0.018996441537406802, 0.024074808645304306, 0.023977414983726866, 0.024311392353973546, 0.07514343449164279, 0.17700901664686344, 0.25790351671638007, 0.33178784728908, 0.30350071138869694, 0.24766804321113534, 0.21078317200309463, 0.2251827445566584, 0.22357328407371238, 0.19212153881608998, 0.3533608307744487, 0.33705491657614267, 0.356857651015818, 0.35161639263438144, 0.4073624019506132, 0.44663807100775255, 0.379972599187185, 0.4042380001866413, 0.4347427555812042, 0.47155699521812555, 0.6186355073102839, 0.5432314830165913, 0.5703526683960902, 0.5615856012831644, 0.5434994035618158, 0.5574367908760288, 0.629101467185531, 0.5491814263608172, 0.4932268950305589, 0.5748065269146424, 0.6157930186127291, 0.7019429646997122, 0.6304527210547975, 0.30184772636024865, 0.1426633838688195, 0.057767851976295886, 0.038954356730352524, 0.026399678584541085, 0.02351201906004375, 0.023863126467751364, 0.024343375508427457, 0.024091581552929026, 0.024068733953895145, 0.02426057539142545, 0.02375602235882243, 0.0243530789873919, 0.023490850842288455, 0.048855591550836276, 0.15531113179204503, 0.31861408370114336, 0.34135209788030585, 0.491752105595704, 0.5001921602412378, 0.3637865691196541, 0.3293408563668257, 0.2699752438294375, 0.28660610785256946, 0.39603247357559757, 0.4409909458910878, 0.4448210501481925, 0.43483130984381113, 0.4530897660929882, 0.6784739388456582, 0.5326121628791903, 0.618474621190118, 0.7702938106117274, 0.5058082342252163, 0.4584166241409233, 0.48180180636201475, 0.44624678213822894, 0.44737624618452937, 0.4722946965445831, 0.39438208078713116, 0.22834502647262367, 0.10664756808309261, 0.05265863756103332, 0.03593834125852638, 0.0260032662084404, 0.023498160680301885, 0.024516299517218995, 0.024033304932045963, 0.034463938569152655, 0.22558363586353422, 0.6275504157228219, 0.626596415662392, 1.0, 0.7868589488082218, 0.9855885951252286, 0.8122175782413286, 0.5929239987570627, 0.36760095269557835, 0.5097508918699215, 0.657323100247662, 0.7912189292164623, 0.7354966402897422, 0.7587725582019198, 0.761241429859505, 0.8529278430768295, 0.8860401131576862, 0.7698347332730001, 0.8097184916575028, 0.6571234141484124, 0.32083485290626895, 0.14235998029674626, 0.06840408438906255, 0.03967127832663272, 0.026092064364594037, 0.024786280962912906, 0.024573149360853964, 0.024665398610693164, 0.02395128353229658, 0.006042592405272025, 0.000000000022603445624574832, 0.0], "confidence": 0.9997, "sample_rate": 16000}
e1052ea7-e778-4644-b172-4334772b4493	2c7789e3-4dce-41fa-9b96-307451e9a59b	\N	completed	2026-08-12 00:24:10.772285+05:30	2026-08-12 00:24:10.772216+05:30	\N	[{"bbox": {"x1": 93.6, "x2": 1422.19, "y1": 22.46, "y2": 1593.5}, "animal": "Giraffe", "class_id": 31, "confidence": 0.9147}]
\.


--
-- Data for Name: media_assets; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.media_assets (id, media_type, original_filename, storage_path, mime_type, file_size_bytes, sha256, uploaded_by, captured_at, latitude, longitude, metadata, created_at) FROM stdin;
4dbc39e4-a484-4e30-8e48-87b27bf48c0c	image	lion.jpg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/lion.jpg	image/jpeg	35984	\N	\N	\N	\N	\N	{}	2026-08-11 10:01:43.441795+05:30
19a57143-f5f2-4f48-8471-68a9d8e09323	image	Animals.jpg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/Animals.jpg	image/jpeg	32245	\N	\N	\N	\N	\N	{}	2026-08-11 11:04:54.423067+05:30
32172f81-eadb-4799-aee1-533b9f4e7054	audio	lion.mp3	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/audio/lion.mp3	application/octet-stream	248685	\N	\N	\N	\N	\N	{}	2026-08-11 14:16:53.845437+05:30
db9d9b39-f334-400a-96e4-bf53b6d9b14b	audio	lion.mp3	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/audio/lion.mp3	application/octet-stream	248685	\N	\N	\N	\N	\N	{}	2026-08-11 15:06:34.43597+05:30
daf6a510-d977-47c2-bb4c-e618e037b1e3	image	lion.jpg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/lion.jpg	image/jpeg	35984	\N	\N	\N	\N	\N	{}	2026-08-11 17:50:42.358671+05:30
014247bc-b4ae-41bb-8b55-92cc7e5e7c81	audio	lion.mp3	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/audio/lion.mp3	audio/mpeg	248685	\N	\N	\N	\N	\N	{}	2026-08-11 17:51:39.891797+05:30
6f89587f-8580-443f-b79d-2471adfd9f10	image	zebra.jpg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/zebra.jpg	image/jpeg	43832	\N	\N	\N	\N	\N	{}	2026-08-11 18:07:52.33207+05:30
bbeecb71-6dfb-4449-b6ad-235c677ea13e	image	zebra.jpg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/zebra.jpg	image/jpeg	43832	\N	\N	\N	\N	\N	{}	2026-08-11 22:35:31.739154+05:30
c3dcade5-2289-4bac-a90a-37ccd391e178	image	giraffe.jpeg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/giraffe.jpeg	image/jpeg	26426	\N	\N	\N	\N	\N	{}	2026-08-11 22:44:06.77824+05:30
1b677064-30db-45f0-ba30-c064014668ad	image	elephant.jpg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/elephant.jpg	image/jpeg	29484	\N	\N	\N	\N	\N	{}	2026-08-11 23:46:14.298271+05:30
cd1b5361-4f8c-4c80-a59e-66e190ff5540	image	Animals.jpg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/Animals.jpg	image/jpeg	32245	\N	\N	\N	\N	\N	{}	2026-08-11 23:55:14.462892+05:30
a8f67461-8f99-40f4-a477-bdc2d1e6e942	audio	elephant.mp3	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/audio/elephant.mp3	audio/mpeg	383477	\N	\N	\N	\N	\N	{}	2026-08-12 00:06:09.783941+05:30
2c7789e3-4dce-41fa-9b96-307451e9a59b	image	Giraffe2.jpg	/Users/kishlaykoundinya/Desktop/Wildlife-Population-Intelligence-System/backend/uploads/images/Giraffe2.jpg	image/jpeg	391686	\N	\N	\N	\N	\N	{}	2026-08-12 00:24:10.438089+05:30
\.


--
-- Data for Name: model_versions; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.model_versions (id, name, model_type, version, file_path, framework, metrics, created_at) FROM stdin;
3dfec552-2926-4135-bffa-082c975d759c	Wildlife YOLOv8 Species Detector	image_detection	1.0	backend/model/best.pt	Ultralytics YOLOv8	{"imgsz": 640, "epochs": 50, "classes": 54}	2026-08-10 22:58:38.887174+05:30
a93ff68d-56d8-44f9-8839-891029e45cb0	Animal AST Audio Classifier	audio_classification	1.0	backend/audio_model/AnimalModel	Hugging Face Transformers AST	{"epochs": 5, "classes": 14, "validation_accuracy": 0.9668284789644013}	2026-08-10 22:58:38.887174+05:30
3a38f851-434e-49a0-be9c-a64ad9d3ce00	CLIP Re-identification	re_identification	1.0	openai/clip-vit-base-patch32	Hugging Face Transformers	{}	2026-08-10 22:58:38.887174+05:30
\.


--
-- Data for Name: reidentifications; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.reidentifications (id, inference_run_id, animal_id, species_id, status, similarity, created_at) FROM stdin;
\.


--
-- Data for Name: species; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.species (id, name, scientific_name, image_class_id, audio_class_id, created_at) FROM stdin;
1	Zebra	\N	0	\N	2026-08-10 22:58:38.886111+05:30
3	Leopard	\N	2	\N	2026-08-10 22:58:38.886111+05:30
4	Cheetah	\N	3	\N	2026-08-10 22:58:38.886111+05:30
5	Tiger	\N	4	\N	2026-08-10 22:58:38.886111+05:30
7	Butterfly	\N	6	\N	2026-08-10 22:58:38.886111+05:30
8	Canary	\N	7	\N	2026-08-10 22:58:38.886111+05:30
9	Crocodile	\N	8	\N	2026-08-10 22:58:38.886111+05:30
10	Bull	\N	9	\N	2026-08-10 22:58:38.886111+05:30
11	Camel	\N	10	\N	2026-08-10 22:58:38.886111+05:30
12	Centipede	\N	11	\N	2026-08-10 22:58:38.886111+05:30
13	Caterpillar	\N	12	\N	2026-08-10 22:58:38.886111+05:30
15	Squirrel	\N	14	\N	2026-08-10 22:58:38.886111+05:30
16	Spider	\N	15	\N	2026-08-10 22:58:38.886111+05:30
17	Ladybug	\N	16	\N	2026-08-10 22:58:38.886111+05:30
20	Fox	\N	19	\N	2026-08-10 22:58:38.886111+05:30
21	Tortoise	\N	20	\N	2026-08-10 22:58:38.886111+05:30
23	Kangaroo	\N	22	\N	2026-08-10 22:58:38.886111+05:30
24	Deer	\N	23	\N	2026-08-10 22:58:38.886111+05:30
27	Snake	\N	26	\N	2026-08-10 22:58:38.886111+05:30
29	Swan	\N	28	\N	2026-08-10 22:58:38.886111+05:30
30	Goat	\N	29	\N	2026-08-10 22:58:38.886111+05:30
31	Rabbit	\N	30	\N	2026-08-10 22:58:38.886111+05:30
32	Giraffe	\N	31	\N	2026-08-10 22:58:38.886111+05:30
33	Goose	\N	32	\N	2026-08-10 22:58:38.886111+05:30
34	PolarBear	\N	33	\N	2026-08-10 22:58:38.886111+05:30
35	Raven	\N	34	\N	2026-08-10 22:58:38.886111+05:30
36	Hippopotamus	\N	35	\N	2026-08-10 22:58:38.886111+05:30
37	BrownBear	\N	36	\N	2026-08-10 22:58:38.886111+05:30
38	Rhinoceros	\N	37	\N	2026-08-10 22:58:38.886111+05:30
41	Magpie	\N	40	\N	2026-08-10 22:58:38.886111+05:30
42	Ostrich	\N	41	\N	2026-08-10 22:58:38.886111+05:30
43	Jaguar	\N	42	\N	2026-08-10 22:58:38.886111+05:30
44	Hedgehog	\N	43	\N	2026-08-10 22:58:38.886111+05:30
45	Turkey	\N	44	\N	2026-08-10 22:58:38.886111+05:30
46	Raccoon	\N	45	\N	2026-08-10 22:58:38.886111+05:30
47	Worm	\N	46	\N	2026-08-10 22:58:38.886111+05:30
48	Harbor	\N	47	\N	2026-08-10 22:58:38.886111+05:30
49	Panda	\N	48	\N	2026-08-10 22:58:38.886111+05:30
50	RedPanda	\N	49	\N	2026-08-10 22:58:38.886111+05:30
51	Otter	\N	50	\N	2026-08-10 22:58:38.886111+05:30
52	Lynx	\N	51	\N	2026-08-10 22:58:38.886111+05:30
53	Scorpion	\N	52	\N	2026-08-10 22:58:38.886111+05:30
54	Koala	\N	53	\N	2026-08-10 22:58:38.886111+05:30
6	Bear	\N	5	0	2026-08-10 22:58:38.886111+05:30
55	bear	\N	\N	0	2026-08-10 22:58:38.886924+05:30
56	cow	\N	\N	1	2026-08-10 22:58:38.886924+05:30
57	donkey	\N	\N	2	2026-08-10 22:58:38.886924+05:30
14	Duck	\N	13	3	2026-08-10 22:58:38.886111+05:30
58	duck	\N	\N	3	2026-08-10 22:58:38.886924+05:30
25	Eagle	\N	24	4	2026-08-10 22:58:38.886111+05:30
59	eagle	\N	\N	4	2026-08-10 22:58:38.886924+05:30
18	Elephant	\N	17	5	2026-08-10 22:58:38.886111+05:30
60	elephant	\N	\N	5	2026-08-10 22:58:38.886924+05:30
22	Frog	\N	21	6	2026-08-10 22:58:38.886111+05:30
61	frog	\N	\N	6	2026-08-10 22:58:38.886924+05:30
19	Horse	\N	18	7	2026-08-10 22:58:38.886111+05:30
62	horse	\N	\N	7	2026-08-10 22:58:38.886924+05:30
2	Lion	\N	1	8	2026-08-10 22:58:38.886111+05:30
63	lion	\N	\N	8	2026-08-10 22:58:38.886924+05:30
26	Monkey	\N	25	9	2026-08-10 22:58:38.886111+05:30
64	monkey	\N	\N	9	2026-08-10 22:58:38.886924+05:30
28	Owl	\N	27	10	2026-08-10 22:58:38.886111+05:30
65	owl	\N	\N	10	2026-08-10 22:58:38.886924+05:30
40	Sheep	\N	39	11	2026-08-10 22:58:38.886111+05:30
66	sheep	\N	\N	11	2026-08-10 22:58:38.886924+05:30
67	wolf	\N	\N	12	2026-08-10 22:58:38.886924+05:30
39	Woodpecker	\N	38	13	2026-08-10 22:58:38.886111+05:30
68	woodpecker	\N	\N	13	2026-08-10 22:58:38.886924+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: wildlife_app
--

COPY public.users (id, name, email, role, created_at) FROM stdin;
\.


--
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wildlife_app
--

SELECT pg_catalog.setval('public.species_id_seq', 68, true);


--
-- Name: audio_predictions audio_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.audio_predictions
    ADD CONSTRAINT audio_predictions_pkey PRIMARY KEY (id);


--
-- Name: identified_animals identified_animals_animal_code_key; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.identified_animals
    ADD CONSTRAINT identified_animals_animal_code_key UNIQUE (animal_code);


--
-- Name: identified_animals identified_animals_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.identified_animals
    ADD CONSTRAINT identified_animals_pkey PRIMARY KEY (id);


--
-- Name: image_detections image_detections_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.image_detections
    ADD CONSTRAINT image_detections_pkey PRIMARY KEY (id);


--
-- Name: inference_runs inference_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.inference_runs
    ADD CONSTRAINT inference_runs_pkey PRIMARY KEY (id);


--
-- Name: media_assets media_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT media_assets_pkey PRIMARY KEY (id);


--
-- Name: model_versions model_versions_name_version_key; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.model_versions
    ADD CONSTRAINT model_versions_name_version_key UNIQUE (name, version);


--
-- Name: model_versions model_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.model_versions
    ADD CONSTRAINT model_versions_pkey PRIMARY KEY (id);


--
-- Name: reidentifications reidentifications_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.reidentifications
    ADD CONSTRAINT reidentifications_pkey PRIMARY KEY (id);


--
-- Name: species species_name_key; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_name_key UNIQUE (name);


--
-- Name: species species_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT species_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_image_detections_run; Type: INDEX; Schema: public; Owner: wildlife_app
--

CREATE INDEX idx_image_detections_run ON public.image_detections USING btree (inference_run_id);


--
-- Name: idx_image_detections_species; Type: INDEX; Schema: public; Owner: wildlife_app
--

CREATE INDEX idx_image_detections_species ON public.image_detections USING btree (species_id);


--
-- Name: idx_inference_runs_media; Type: INDEX; Schema: public; Owner: wildlife_app
--

CREATE INDEX idx_inference_runs_media ON public.inference_runs USING btree (media_id);


--
-- Name: idx_media_assets_created_at; Type: INDEX; Schema: public; Owner: wildlife_app
--

CREATE INDEX idx_media_assets_created_at ON public.media_assets USING btree (created_at);


--
-- Name: idx_media_assets_sha256; Type: INDEX; Schema: public; Owner: wildlife_app
--

CREATE INDEX idx_media_assets_sha256 ON public.media_assets USING btree (sha256);


--
-- Name: idx_media_assets_type; Type: INDEX; Schema: public; Owner: wildlife_app
--

CREATE INDEX idx_media_assets_type ON public.media_assets USING btree (media_type);


--
-- Name: audio_predictions audio_predictions_inference_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.audio_predictions
    ADD CONSTRAINT audio_predictions_inference_run_id_fkey FOREIGN KEY (inference_run_id) REFERENCES public.inference_runs(id) ON DELETE CASCADE;


--
-- Name: audio_predictions audio_predictions_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.audio_predictions
    ADD CONSTRAINT audio_predictions_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.species(id) ON DELETE SET NULL;


--
-- Name: identified_animals identified_animals_first_seen_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.identified_animals
    ADD CONSTRAINT identified_animals_first_seen_media_id_fkey FOREIGN KEY (first_seen_media_id) REFERENCES public.media_assets(id) ON DELETE SET NULL;


--
-- Name: identified_animals identified_animals_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.identified_animals
    ADD CONSTRAINT identified_animals_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.species(id) ON DELETE RESTRICT;


--
-- Name: image_detections image_detections_inference_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.image_detections
    ADD CONSTRAINT image_detections_inference_run_id_fkey FOREIGN KEY (inference_run_id) REFERENCES public.inference_runs(id) ON DELETE CASCADE;


--
-- Name: image_detections image_detections_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.image_detections
    ADD CONSTRAINT image_detections_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.species(id) ON DELETE SET NULL;


--
-- Name: inference_runs inference_runs_media_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.inference_runs
    ADD CONSTRAINT inference_runs_media_id_fkey FOREIGN KEY (media_id) REFERENCES public.media_assets(id) ON DELETE CASCADE;


--
-- Name: inference_runs inference_runs_model_version_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.inference_runs
    ADD CONSTRAINT inference_runs_model_version_id_fkey FOREIGN KEY (model_version_id) REFERENCES public.model_versions(id) ON DELETE SET NULL;


--
-- Name: media_assets media_assets_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT media_assets_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: reidentifications reidentifications_animal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.reidentifications
    ADD CONSTRAINT reidentifications_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES public.identified_animals(id) ON DELETE SET NULL;


--
-- Name: reidentifications reidentifications_inference_run_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.reidentifications
    ADD CONSTRAINT reidentifications_inference_run_id_fkey FOREIGN KEY (inference_run_id) REFERENCES public.inference_runs(id) ON DELETE CASCADE;


--
-- Name: reidentifications reidentifications_species_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: wildlife_app
--

ALTER TABLE ONLY public.reidentifications
    ADD CONSTRAINT reidentifications_species_id_fkey FOREIGN KEY (species_id) REFERENCES public.species(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 1EglpNiPvQA3YAyJNHbuIQ2P2bjt9JGVorpz0GuhXBZuHsmvZG2RFeDhjKzLbfb


# AI research in Armenia

**Status:** Release candidate
**Evidence checked:** August 2026

This chapter maps organizations in Armenia that publicly conduct research using machine learning or AI. It distinguishes three parts of the ecosystem:

- **Academic AI research groups:** university and nonprofit groups for which AI methods, models, datasets, or benchmarks are a central research purpose. These include the YSU Machine Learning Research Group / YerevaNN, CAST's Machine Learning Research Group at RAU, the YSU Artificial Intelligence Laboratory, the AUA/FAST ADVANCE Data-science Research Group, AUA Computer Vision and Medical Imaging Research, the Mathematical Modeling & Machine Learning Laboratory at the NAS RA Institute of Mechanics, and the completed YSU/FAST Computer Vision Research Group.
- **Industrial AI research groups:** company teams that publish papers or release research outputs such as models, datasets, or benchmarks. The chapter covers Picsart AI Research, NVIDIA Armenia, Metric AI Lab, Deep Origin, Denovo Sciences, Toxometris, ServiceTitan Armenia, and Amaros AI.
- **Academic research groups that use AI within another field:** groups primarily studying materials, physics, astronomy, mathematics, optics, biology, control, or another domain, with ML as one research method. These include the YSU Computational Materials Science Laboratory and its collaborators at the A.B. Nalbandyan Institute of Chemical Physics, the Division of Quantum Technologies at the A. Alikhanyan National Laboratory, ICRANet-Armenia, scientific-ML researchers at the Institute of Mathematics of NAS RA and YSU, the YSU Photonics and Artificial Intelligence Laboratory, the Center for Scientific Innovation and Education at NPUA, the FAST ADVANCE drug-discovery group hosted by the L.A. Orbeli Institute of Physiology, the Armenian Bioinformatics Institute, and the Institute of Molecular Biology of NAS RA.

## Scope

Groups are included when their AI activity is documented through relevant papers, active research projects, or public models, datasets, and benchmarks. The chapter uses institutional pages, publication records, conference programs, and public research repositories as evidence.

The map is limited to publicly documented affiliations and outputs. Multi-institution and company papers are attributed to their Armenia-based contributors rather than treated as wholly Armenia-based projects.

## Academic AI research groups

### YSU Machine Learning Research Group / YerevaNN

**Institution and history.** YerevaNN began in 2016 as an independent scientific-educational nonprofit. The research team was later integrated into Yerevan State University as the YSU Machine Learning Research Group, while the YerevaNN Foundation continued to support research, fundraising, and scientific community building. The two names therefore describe one overlapping research group, not two labs.

**How the group uses AI.** The group's current program has two main directions:

- **AI for robotics:** learning-based perception from visual, multispectral, radar/SAR, and wireless signals, together with high-level robot control and navigation using vision-language models and vision-language-action approaches.
- **AI for molecules:** generative and predictive models for two-dimensional molecular structures, three-dimensional conformers, and multi-objective molecular generation and optimization.

**Recent AI publications.**

Robotics, perception, and control:

- [Enhancing Aerial Vision-Language Navigation with Map Grounding and History Awareness](https://openreview.net/forum?id=AqgVRok7j8), ICLR 2026 ES-Reasoning Workshop.
- [GeoCrossBench: Cross-Band Generalization for Remote Sensing](https://openreview.net/forum?id=2PVcpYjZNw), ICLR 2026 ML4RS Workshop; an earlier version appeared at an ICML 2025 workshop.
- [HOSS-Bench: Open-Set Cross-Modal Vessel Re-Identification Benchmark](https://openreview.net/forum?id=hZwvQwTfU8), ICLR 2026 ML4RS Workshop, using RGB and synthetic-aperture-radar imagery.
- [Bridging the Sim-to-real Gap in RF Localization with Large-Scale Synthetic Pretraining](https://openreview.net/forum?id=VzDCtHKr8w), ICLR 2026 DATA-FM Workshop, following the 2025 *Information Fusion* paper of the same line.
- [Fusion of Pervasive RF Data with Spatial Images via Vision Transformers for Enhanced Mapping in Smart Cities](https://arxiv.org/abs/2508.03736), *Pervasive and Mobile Computing*, 2026.
- [Teaching Visual Language Models to Navigate using Maps](https://openreview.net/forum?id=CMRRNFejHb), ICLR 2025 Robot Learning Workshop.

Molecular generation and optimization:

- [PMO-Dock: Benchmarking Docking, Specificity and Generalization in Molecular Optimization](https://openreview.net/forum?id=KTjveJQe96), ICLR 2026 GEM Workshop.
- [Accurate Tokenization of 3D Small Organic Molecules](https://openreview.net/forum?id=T1gXKJ5lWK), ICLR 2026 FM4Science Workshop; introduces CoordToken for representing 3D molecular conformers.
- [Towards Molecular Conformer Generation with Language Models](https://openreview.net/forum?id=zmOb9XQtJR), ICML 2025 FM4LS and GenBio Workshops.
- [Towards Scaling Laws for Language Model Powered Evolutionary Algorithms: Case Study on Molecular Optimization](https://openreview.net/forum?id=jVAeX6dgDI), ICLR 2025 GEM Workshop.
- [BARTSmiles: Generative Masked Language Models for Molecular Representations](https://arxiv.org/abs/2211.16349), an earlier foundation for the group's molecular-language-model work.

The group also publishes on general ML questions. A recent example is [In-context learning in presence of spurious correlations](https://openreview.net/forum?id=C9CSaTR1iA), published in *Transactions on Machine Learning Research* in 2026.

**Funding.** More than half of the group's funding comes from Higher Education and Science Committee research grants administered through YSU. The remainder is fundraised by the YerevaNN Foundation from donors and local companies.

### CAST Machine Learning Research Group, RAU

**Institution and history.** The [Center of Advanced Software Technologies (CAST)](https://castech.am/) at the Russian-Armenian University is a broader software-research center covering compilers, program analysis, cloud systems, autonomous systems, robotics, ML, and AI. Its **Machine Learning Research Group** is led by [Karen Avetisyan](https://impht.rau.am/en/lecturer/karen-avetisyan).

**How the group uses AI.** The group develops ML methods and applications in speech and language processing for Armenian and other low-resource languages, including LLM benchmarks, as well as adversarial robustness of language models, distributed learning, multimodal emotion recognition, biomedical signal classification, and efficient computer vision.

**Selected researchers.** Researchers with publicly documented AI work include:

- [Karen Avetisyan](https://impht.rau.am/en/lecturer/karen-avetisyan) — lead of the Machine Learning Research Group; natural-language processing, Armenian language technologies, and machine learning.
- [Shahane Tigranyan](https://impht.rau.am/en/lecturer/tigranyan-shagane-tigranovna) — engineer-programmer at CAST; machine learning, biomedical signals, distributed learning, and multimodal recognition.
- [Olga Hovhannisyan](https://impht.rau.am/en/lecturer/olga-hovhannisyan) — researcher at CAST; machine learning, computer vision, and NLP.
- [Vardan Sahakyan](https://impht.rau.am/en/lecturer/vardan-rafiki-sahakyan) — researcher at CAST; machine learning, computer vision, reinforcement learning, control, and robotics.

**Recent AI publications.** Recent publications include:

- [Automatic Speech Recognition for Armenian Dialects](https://doi.org/10.1007/s10772-026-10255-y), *International Journal of Speech Technology*, 2026.
- [BANT: Byzantine Antidote via Trial Function and Trust Scores](https://doi.org/10.1609/aaai.v40i29.39625), AAAI 2026, on Byzantine-robust distributed machine learning.
- *Adversarial Attacks on Language Models: Risks, Methods, and Countermeasures*, 2024.
- *Bi-dialectal Automatic Speech Recognition for Armenian*, SIGUL 2024.
- [Cross-lingual plagiarism detection: Two are Better Than One](https://arxiv.org/abs/2304.01352), 2023.
- [An Accurate Real-Time Object Tracking Method for Resource-Constrained Devices](https://www.ispras.ru/proceedings/docs/2024/36/3/isp_36_2024_3_283.pdf), 2024.
- [Enhancing Image Recognition with Pre-Defined Convolutional Layers Based on PDEs](https://doi.org/10.1134/S0361768823030088), *Programming and Computer Software*, 2023; Vardan Sahakyan, with RAU affiliation.
- [Comparison of Single Object Tracking Algorithms on Video Sequences Captured from UAV](https://doi.org/10.48200/1829-0450_pmn_2022_2_6), *Vestnik of RAU*, 2022; Vardan Sahakyan and Olga Hovhannisyan.
- [Comparing and Improving Change Detection Methods](https://vestnik.rau.am/uploads/documents/1719577625.pdf), *Vestnik of RAU*, 2024; Vardan Sahakyan and Olga Hovhannisyan among the RAU-affiliated authors.

**Funding.** No public breakdown of the ML group's current funding is available.

### YSU Artificial Intelligence Laboratory

**Institution and history.** This YSU laboratory was founded in 2022 and is headed by Ashot Harutyunyan. It is a separate research group from the YSU Machine Learning Research Group / YerevaNN.

**How the group uses AI.** Its recent work develops interpretable and uncertainty-aware machine-learning methods, including classifiers and clustering methods based on Dempster-Shafer theory.

**Recent AI publications.** Recent outputs associated with Ashot Harutyunyan and collaborators include:

- [DSGD++: Reducing Uncertainty and Training Time in the DSGD Classifier through a Mass Assignment Function Initialization Technique](https://doi.org/10.3897/jucs.164745), *Journal of Universal Computer Science*, 2025.

**Funding.** YSU, state grants, and industry collaborations.

### AUA/FAST ADVANCE Data-science Research Group

**Institution and history.** This research group was established through FAST's ADVANCE program, hosted and co-implemented by the American University of Armenia, and remotely supervised by [Nelson Baloian](https://www.fast.foundation/en/staff/7047) of the University of Chile. Ashot Harutyunyan and Arnak Poghosyan were the senior local researchers; the team also included junior researchers and research interns. After ADVANCE funding ended, substantially the same team continued its research and publications.

**How the group uses AI.** The group develops interpretable and robust machine-learning methods for ill-structured data, with applications to automated diagnosis, root-cause analysis, incident discovery, intelligent trace sampling, and knowledge retrieval in complex cloud systems.

**Recent AI publications.**

- [Explaining Performance Issues of Cloud Applications From Logs Using Rule Induction and Dempster-Shafer Theory](https://doi.org/10.1109/ACCESS.2026.3686885), *IEEE Access*, 2026.
- [Interpretable Clustering Using Dempster-Shafer Theory](https://doi.org/10.3897/jucs.164694), *Journal of Universal Computer Science*, 2025.
- [A Study on Automated Problem Troubleshooting in Cloud Environments with Rule Induction and Verification](https://doi.org/10.3390/app14031047), *Applied Sciences*, 2024.
- [Discovery of Cloud Applications from Logs](https://doi.org/10.3390/fi16060216), *Future Internet*, 2024.
- [The Diagnosis-Effective Sampling of Application Traces](https://doi.org/10.3390/app14135779), *Applied Sciences*, 2024.
- [Knowledge Retrieval and Diagnostics in Cloud Services with Large Language Models](https://doi.org/10.1016/j.eswa.2024.124736), *Expert Systems with Applications*, 2024.
- [Optimizing SaaS Solutions for Enhanced Sustainability and Predictive Management of Cloud Assets](https://doi.org/10.1145/3639592.3639620), AICCC 2023 proceedings, published 2024.
- [Discovery of Cloud Incidents Through Streaming Consolidation of Events Across Timeline and Topology Hierarchy](https://doi.org/10.1109/NOMS59830.2024.10575213), IEEE/IFIP NOMS 2024.
- [An Empirical Analysis of Feature Engineering for Dempster-Shafer Classifier as a Rule Validator](https://upapers.dcc.uchile.cl/index/publications/view/314263), CODASSCA 2024.
- [An Explainable Clustering Algorithm Using Dempster-Shafer Theory](https://www.logos-verlag.com/ebooks/OA/978-3-8325-5855-0.pdf), CODASSCA 2024.
- [Challenges and Experiences in Designing Interpretable KPI-diagnostics for Cloud Applications](https://doi.org/10.3897/jucs.112570), *Journal of Universal Computer Science*, 2023.
- [Distributed Tracing for Troubleshooting of Native Cloud Applications via Rule-Induction Systems](https://doi.org/10.3897/jucs.112513), *Journal of Universal Computer Science*, 2023.

**Funding.** FAST's ADVANCE program funded the group and lists AUA as its co-funding and co-implementing institution. The group's current funding is not publicly itemized.

### AUA Computer Vision and Medical Imaging Research

**Institution and organization.** This activity is centered on AUA researchers and projects rather than a single institution-wide AI laboratory. Researchers including Varduhi Yeghiazaryan develop computer-vision methods for biomedical and hyperspectral imaging.

**How the group uses AI.** The research develops segmentation, super-resolution, classification, and learning methods for hyperspectral and medical images. AUA's [Engineering Research Center project list](https://cse.aua.am/erc/ongoing-projects/) documents a broader collection of related AI projects.

**Recent AI publications.** Recent publications include:

- [PLESS: Pseudo-Label Enhancement with Spreading Scribbles for Weakly Supervised Segmentation](https://arxiv.org/abs/2602.11628), 2026 preprint.
- [Joint Super-Resolution and Spectral Reconstruction via Linear Initialization of a Pretrained RGB Model](https://www.cmsworkshops.com/ICASSP2026/view_paper.php?PaperNum=19071&bare=1), ICASSP 2026.
- [Comparative Analysis of Deep Learning Methods for Classification of Ablated Regions in Hyperspectral Images of Atrial Tissue](https://era-chair.am/wp-content/uploads/outputs/publications/5.%20Comparative_Analysis_of_Deep_Learning_Methods_for_Classification_of_Ablated_Regions_in_Hyperspectral_Images_of_Atrial_Tissue.pdf), *IEEE Access*, 2025.
- *Combining 4D Hyperspectral Imaging With CNN for Nerve and Ligament Differentiation*, ISBI 2025.

**Funding.** Project-specific university and grant support includes the Afeyan Family Foundation Research Grant, which [AUA reports](https://newsroom.aua.am/2025/12/15/acse-research-team-presents-joint-work-ieee-international-conference/) supported an ICIP 2025 hyperspectral-imaging paper.

### Mathematical Modeling & Machine Learning Laboratory, Institute of Mechanics of NAS RA

**Institution and history.** The [Mathematical Modeling & Machine Learning Laboratory (M3L)](https://m3l.am/) was established in June 2025 at the Institute of Mechanics of NAS RA and is led by Davit Piliposyan. It brings together researchers from the institute, YSU, IIAP, and industry.

**How the group uses AI.** M3L works at the intersection of machine learning and computational mechanics. Its program includes physics-informed learning and differentiable finite-element methods, 3D scene understanding, event-sequence representations, and agentic systems for retrieval, simulation, and optimization workflows.

**Recent AI publication.** [Z3D: Zero-Shot 3D Visual Grounding from Images](https://aclanthology.org/2026.acl-short.13/), ACL 2026, introduces a pipeline for localizing objects described in natural language within 3D scenes using multi-view images and vision-language models.

**Funding.** No public breakdown of the laboratory's current funding is available.

### YSU/FAST Computer Vision Research Group

**Institution and history.** The Yerevan-based computer-vision group began with Hrach Ayunts, Hayk Gasparyan, and Sargis Hovhannisyan under the remote supervision of Sos Agaian through FAST's ADVANCE program. Hrach Ayunts subsequently became a local supervisor and, after defending his PhD, joined Yerevan State University's Faculty of Applied Mathematics and Informatics. The group continued its research after ADVANCE funding ended, supported through Armenia's state research-funding system.

**How the group uses AI.** The group developed deep-learning methods for robust visual perception, particularly visible and thermal image enhancement, object detection in adverse weather, multispectral and hyperspectral reconstruction, remote-sensing segmentation, and solar-panel fault detection.

**Recent AI publications.** Relevant outputs include:

- [Robust Perception in Degraded Visual Environments: A Multimodal Enhancement Framework](https://doi.org/10.1134/S1054661825700828), *Pattern Recognition and Image Analysis*, published online in 2026; the article records support from YSU and FAST ADVANCE.
- [Thermal Video Enhancement Mamba: A Novel Approach to Thermal Video Enhancement for Real-World Applications](https://doi.org/10.3390/info16020125), *Information*, 2025.
- [A New Method for Judging Thermal Image Quality with Applications](https://doi.org/10.1016/j.sigpro.2024.109769), *Signal Processing*, 2025.
- [Efficient Lightweight Networks for Solar Panel Fault Classification Using EL and RGB Imagery](https://ieeexplore.ieee.org/document/10912698/), *IEEE Transactions on Instrumentation and Measurement*, 2025.
- [EOD-Net: Enhancing Object Detection in Challenging Weather Conditions Using an Innovative End-to-End Dehazing Network](https://doi.org/10.1109/IPTA59101.2023.10320070), IPTA 2023.
- [Fourier Multispectral Transformer for Robust Hyperspectral Reconstruction and Remote Sensing Segmentation](https://doi.org/10.1134/S1054661825701317), *Pattern Recognition and Image Analysis*, 2026.

**Funding.** The original collaboration was funded through FAST's ADVANCE program. After the ADVANCE grant ended, the group's research continued with state funding.

[FAST's Machine Learning project](https://fast.foundation/en/blog-in/7501), co-implemented with YSU and led by Arnak Dalalyan, operated from 2020 to 2024 and produced five publications on robust estimation, feature matching under noise and outliers, and generative modeling, including papers at AISTATS 2023 and ICML 2024. The group included [Arshak Minasyan](https://pointguard0.github.io/), now at CentraleSupélec in France; Tigran Galstyan, who recently joined NVIDIA Armenia; and [Sona Hunanyan](https://www.fast.foundation/en/staff/3659), who returned from Switzerland to join the project and now works at Philip Morris International.

## Industrial AI research groups

Industrial AI research groups are funded by their respective companies; company-level research budgets are generally not disclosed. Since 2025, Armenian resident companies have also been able to seek formal qualification of research projects as R&D under a national tax-incentive scheme. The [Ministry of High-Tech Industry publishes the application guidance](https://old.hightech.gov.am/en/tegekatvakan-kentron/ayl/norutyunner/r-d), while an interagency expert commission evaluates whether projects meet the qualification criteria. According to the Ministry's [overview of the scheme](https://old.hightech.gov.am/en/tegekatvakan-kentron/ayl/norutyunner/to-knowledge-based-economy), qualifying activity is eligible for deductions in calculating profit tax and for depreciation deductions, while eligible employees performing professional R&D work are subject to a 10% income-tax rate.

### Picsart AI Research (PAIR)

**Institution and history.** Picsart maintains a company research program commonly presented as Picsart AI Research or PAIR. Armenia-based contributors include Shant Navasardyan, Levon Khachatryan, and Barsegh Atanyan. Its [public research page](https://staging.picsart.ai/research) and [Hugging Face paper collection](https://huggingface.co/PAIR/papers) document its scientific output.

**How the group uses AI.** PAIR develops generative and discriminative computer-vision models for image and video creation, editing, inpainting, segmentation, and controllable diffusion.

**Recent AI publications.** Examples include:

- [FlowDIS: Language-Guided Dichotomous Image Segmentation with Flow Matching](https://openaccess.thecvf.com/content/CVPR2026/html/Sargsyan_FlowDIS_Language-Guided_Dichotomous_Image_Segmentation_with_Flow_Matching_CVPR_2026_paper.html), CVPR 2026, by Andranik Sargsyan and Shant Navasardyan.
- [Beyond Realism: Learning the Art of Expressive Composition with StickerNet](https://openaccess.thecvf.com/content/WACV2026/papers/Lu_Beyond_Realism_Learning_the_Art_of_Expressive_Composition_with_StickerNet_WACV_2026_paper.pdf), WACV 2026.
- [StreamingT2V: Consistent, Dynamic, and Extendable Long Video Generation from Text](https://openaccess.thecvf.com/content/CVPR2025/html/Henschel_StreamingT2V_Consistent_Dynamic_and_Extendable_Long_Video_Generation_from_Text_CVPR_2025_paper.html), CVPR 2025, with Shant Navasardyan.
- [HD-Painter: High-Resolution and Prompt-Faithful Text-Guided Image Inpainting with Diffusion Models](https://openreview.net/forum?id=6lB5qtdYAg), ICLR 2025, with Shant Navasardyan.
- [Zero-Painter: Training-Free Layout Control for Text-to-Image Synthesis](https://openaccess.thecvf.com/content/CVPR2024/html/Ohanyan_Zero-Painter_Training-Free_Layout_Control_for_Text-to-Image_Synthesis_CVPR_2024_paper.html), CVPR 2024, with Shant Navasardyan.
- [Grounded-Instruct-Pix2Pix: Improving Instruction-Based Image Editing with Automatic Target Grounding](https://cmsworkshops.com/ICASSP2024/view_paper.php?PaperNum=6486), ICASSP 2024.
- [Specialist Diffusion: Plug-and-Play Sample-Efficient Fine-Tuning of Text-to-Image Diffusion Models To Learn Any Unseen Style](https://openaccess.thecvf.com/content/CVPR2023/html/Lu_Specialist_Diffusion_Plug-and-Play_Sample-Efficient_Fine-Tuning_of_Text-to-Image_Diffusion_Models_To_CVPR_2023_paper.html), CVPR 2023, with Shant Navasardyan.

### NVIDIA Armenia research team

**Organization.** NVIDIA's Armenia research team contributes primarily to the company's international research programs in language models and speech. The report does not identify a dedicated NVIDIA robotics operation in Armenia.

**Publishing researchers based in Armenia.** [Erik Arakelyan](https://scholar.google.com/citations?user=63BfrxMAAAAJ), [Edgar Minasyan](https://scholar.google.com/scholar?q=author%3A%22Edgar+Minasyan%22), [Rima Shahbazyan](https://am.linkedin.com/in/rima-shahbazyan), [Ivan Moshkov](https://am.linkedin.com/in/i-vainn), [Daria Gitman](https://am.linkedin.com/in/daria-gitman), [Alexan Ayrapetyan](https://openreview.net/profile?id=~Alexan_Ayrapetyan1), [Sofia Kostandian](https://am.linkedin.com/in/sofia-kostandian-a0b555197), [Nune Tadevosyan](https://am.linkedin.com/in/nune-tadevosyan-9806a8207), George Zelenfroynd, [Aleksei Karmanov](https://am.linkedin.com/in/akarmanov), [Aigul Dzhumamuratova](https://am.linkedin.com/in/aigul-dzhumamuratova-78232b234), Viktor Kuznetsov, [Lilit Grigoryan](https://am.linkedin.com/in/lilgrigs), Vladimir Bataev, Andrei Andrusenko, and Davit Karamyan.

**Former Armenia-based publishing researchers.** Nikolay Karpov was part of the Armenia team through 2025. Monica Sekoyan's 2025 *Granary* paper lists her with an NVIDIA Armenia affiliation; she is now based in Edinburgh. Aleksandr Laptev published NVIDIA speech-recognition work while based in Armenia in 2022 and is now based in California.

**How they use AI.** Their recent publications cover language-model reasoning and robustness, NVIDIA Nemotron model development, speech recognition and translation, diarization, and simultaneous speech translation. A 2025 visual-odometry paper has Armenia-based co-authors, but this publication alone is not treated as evidence of a local robotics team.

**Reverse brain drain.** NVIDIA Armenia provides a local research environment for researchers who trained and established publication records at leading universities abroad to continue their careers in Armenia. [Erik Arakelyan](https://scholar.google.com/citations?user=63BfrxMAAAAJ) moved to Armenia after completing his PhD at the University of Copenhagen. [Edgar Minasyan](https://scholar.google.com/scholar?q=author%3A%22Edgar+Minasyan%22) similarly moved to Armenia after completing his PhD at Princeton University. Their subsequent relocation illustrates the team's role in attracting internationally trained researchers to Armenia.

**Recent AI publications.** Examples include:

- [L0-Reasoning Bench: Evaluating Procedural Correctness in Language Models via Simple Program Execution](https://arxiv.org/abs/2503.22832), 2025, an NVIDIA paper with Erik Arakelyan.
- [OpenMathInstruct-1: A 1.8 Million Math Instruction Tuning Dataset](https://proceedings.nips.cc/paper_files/paper/2024/hash/3d5aa9a7ce28cdc710fbd044fd3610f3-Abstract-Datasets_and_Benchmarks_Track.html), NeurIPS 2024, with Ivan Moshkov and Daria Gitman.
- [OpenMathInstruct-2: Accelerating AI for Math with Massive Open-Source Instruction Data](https://openreview.net/forum?id=l5FDMofecw), ICLR 2025, with Ivan Moshkov and Alexan Ayrapetyan.
- [NVIDIA Nemotron 3: Efficient and Open Intelligence](https://arxiv.org/abs/2512.20856) and [Nemotron-Math](https://arxiv.org/abs/2512.15489), 2025-2026 technical reports with Edgar Minasyan; the Nemotron 3 report also includes Rima Shahbazyan, Ivan Moshkov, and Daria Gitman.
- [NVIDIA Nemotron Nano 2: An Accurate and Efficient Hybrid Mamba-Transformer Reasoning Model](https://arxiv.org/abs/2508.14444), 2025, with Rima Shahbazyan.
- [Evaluating Robustness in Latent Diffusion Models via Embedding Level Augmentation](https://arxiv.org/abs/2506.07706), 2025, with Aleksei Karmanov.
- [Methods to Increase the Amount of Data for Speech Recognition for Low Resource Languages](https://arxiv.org/abs/2501.14788), 2025, with Alexan Ayrapetyan, Sofia Kostandian, Nune Tadevosyan, and Nikolay Karpov.
- [Granary: Speech Recognition and Translation Dataset in 25 European Languages](https://arxiv.org/abs/2505.13404), Interspeech 2025, with Monica Sekoyan, George Zelenfroynd, Sofia Kostandian, and Nikolay Karpov under the paper's NVIDIA Armenia affiliation.
- [FlexCTC: GPU-powered CTC Beam Decoding With Advanced Contextual Abilities](https://arxiv.org/abs/2508.07315) and [TurboBias: Universal ASR Context-Biasing Through Adaptive Subword Encodings and GPU-Accelerated Decoding](https://arxiv.org/abs/2508.07014), 2025, with Yerevan-based authors including Lilit Grigoryan, Vladimir Bataev, Andrei Andrusenko, and Nikolay Karpov.
- [The CHiME-7 Challenge: System Description and Performance of NeMo Team's DASR System](https://arxiv.org/abs/2310.12378), 2023, with Nikolay Karpov.
- [NeMo@IWSLT 2026: Cascaded System for Simultaneous Speech Translation](https://aclanthology.org/2026.iwslt-1.23/), with Yerevan-based researchers Lilit Grigoryan, Vladimir Bataev, Andrei Andrusenko, and Davit Karamyan; Nikolay Karpov, who was part of the Armenia team through 2025, is also a co-author.
- [cuVSLAM: CUDA Accelerated Visual Odometry and Mapping](https://arxiv.org/abs/2506.04359), 2025, with Armenia-based co-authors Aigul Dzhumamuratova and Viktor Kuznetsov.
- [Fast Entropy-Based Methods of Word-Level Confidence Estimation for End-To-End Automatic Speech Recognition](https://arxiv.org/abs/2212.08703), 2022, with then-Armenia-based NVIDIA researcher Aleksandr Laptev.

### Metric AI Lab

**Institution and history.** [Metric AI](https://metric.am/research.html) presents itself as an Armenia-based research lab focused on language technologies. Its public [Hugging Face organization](https://huggingface.co/Metric-AI) lists team members and releases.

**How the group uses AI.** The lab lists three programs: physical AI, including spatial reasoning and long-horizon robot planning; text-embedding models and evaluation for Armenian and other low-resource languages; and visual-document retrieval. The physical-AI program is presented as its current primary focus, while the document-retrieval line is described as past work.

**Recent AI publications and outputs.** Public work includes:

- [Less is More: Adapting Text Embeddings for Low-Resource Languages with Small Scale Noisy Synthetic Data](https://aclanthology.org/2026.loreslm-1.31/), LoResLM 2026.
- [ArmBench-LLM](https://huggingface.co/blog/Metric-AI/armbench-llm), a benchmark for evaluating language models on Armenian tasks.
- [ATE-2](https://huggingface.co/blog/Metric-AI/ate-2), a family of Armenian text-embedding models released together with the ArmBench-TextEmbed benchmark, including public [base](https://huggingface.co/Metric-AI/armenian-text-embeddings-2-base) and [large](https://huggingface.co/Metric-AI/armenian-text-embeddings-2-large) checkpoints.
- *JEPA for Long-Horizon Robotic Planning*, listed by the lab as under review at NeurIPS 2026.

### Deep Origin

**Organization.** Armenia-based Deep Origin researchers with recent publications include Tsolak Ghukasyan, Vahagn Altunyan, Aram Bughdaryan, Tigran Aghajanyan, Khachik Smbatyan, and Garik Petrosyan.

**How they use AI.** Public work combines large-language-model agents for drug-discovery workflows, active learning and graph neural networks for molecular-property prediction and quantum-chemistry dataset construction, and hybrid machine-learning and physics-based methods for molecular docking and virtual screening.

**Recent AI publications.**

- [Overcoming the accuracy-generalization tradeoff in docking and scoring for prospective virtual screening](https://doi.org/10.64898/2026.08.03.742480), bioRxiv preprint, 2026. The paper introduces DODock and DOScore, hybrid ML-and-physics systems for predicting protein-ligand binding poses and ranking compounds. It reports prospective screening results across four therapeutic targets, including a 30.6% experimental hit rate for CD73 and a blind PCSK9 binding-pose prediction later confirmed by crystallography.
- [A bivalent molecular glue linking lysine acetyltransferases to oncogene-induced cell death](https://doi.org/10.1016/j.cell.2026.06.037), *Cell*, 2026. Deep Origin researchers Artur Hakobyan, Vahram Arakelov, Garik Petrosyan, and Aram Davtyan contributed molecular docking, molecular-dynamics simulations, and quantum-mechanical calculations that helped explain the activity of the lead compound against diffuse large B-cell lymphoma.
- [Smart distributed data factory volunteer computing platform for active learning-driven molecular data acquisition](https://www.nature.com/articles/s41598-025-90981-6), *Scientific Reports*, 2025. The work introduces an active-learning platform that uses ensembles of graph neural networks to select molecular conformations for distributed quantum-chemistry calculations and releases a dataset of more than two million conformations with DFT-calculated energies.
- [Can AI Agents Design and Implement Drug Discovery Pipelines?](https://arxiv.org/abs/2504.19912), 2025, introduces the DO Challenge benchmark and the Deep Thought multi-agent system.

### Denovo Sciences

**Organization.** [Denovo Sciences](https://denovosciences.ai/) is an Armenia-founded, research-driven drug-discovery company with a scientific and engineering team in Yerevan. Its [public research page](https://denovosciences.ai/page/news-and-publications) documents its publications and research resources.

**How it uses AI.** Denovo develops generative and predictive methods for small-molecule drug discovery. Its platform combines deep reinforcement learning, molecular modeling, virtual screening, and machine-learning-based assessment to generate and prioritize drug candidates.

**AI and computational drug-discovery publications.**

- [Multi-target Computational Pipeline for Discovery of Pan-influenza Neuraminidase Inhibitors](https://doi.org/10.3389/fphar.2026.1721276), *Frontiers in Pharmacology*, 2026.
- [Can Artificial Intelligence Transform Antiviral Drug Discovery?](https://doi.org/10.1016/j.drudis.2026.104648), *Drug Discovery Today*, 2026.
- [Machine Learning-Based Soft Voting Ensemble Model for the Prediction of Oral Drug-Likeness of Chemical Structures](https://doi.org/10.1021/acs.jcim.5c02953), *Journal of Chemical Information and Modeling*, 2026; introduces the HADES drug-likeness model.
- [Data-driven Discovery of Chemical Signatures for Developing New Inhibitors Against Human Influenza Viruses](https://doi.org/10.1186/s13065-025-01540-z), *Journal of Cheminformatics*, 2025.
- [Discovery of New Antiviral Agents Through Artificial Intelligence: In Vitro and In Vivo Results](https://doi.org/10.1016/j.antiviral.2024.105818), *Antiviral Research*, 2024.
- [Computational Evaluation and Benchmark Study of 342 Crystallographic Holo-structures of SARS-CoV-2 Mpro Enzyme](https://doi.org/10.1038/s41598-024-65228-5), *Scientific Reports*, 2024.
- [Targeting SARS-CoV-2 Main Protease: A Comprehensive Approach Using Advanced Virtual Screening, Molecular Dynamics, and In Vitro Validation](https://doi.org/10.1186/s12985-024-02607-4), *Virology Journal*, 2024.

### Toxometris

**Organization.** Toxometris conducts Armenia-linked research in computational toxicology and molecular ML. Its publications include researchers Zaven Navoyan, Ani Tevosyan, Nelly Babayan, Lusine Khondkaryan, Hayk Navasardyan, Gohar Tadevosyan, and Lilit Apresyan, with collaborations involving YerevaNN, YSU, and the Institute of Molecular Biology of NAS RA.

**How it uses AI.** Its research covers learned molecular representations, QSAR modeling with molecular descriptors and fingerprints, graph neural networks, language models, boosting ensembles, and consensus models for toxicity, carcinogenicity, and molecular-property prediction.

**Collaboration with IMB and YerevaNN.** Toxometris, the Institute of Molecular Biology of NAS RA, and YerevaNN have an established collaboration connecting biological and toxicological expertise with ML model development. Their joint publications include:

- [Improving VAE based molecular representations for compound property prediction](https://pmc.ncbi.nlm.nih.gov/articles/PMC9569108/), *Journal of Cheminformatics*, 2022.
- [Datasets Construction and Development of QSAR Models for Predicting Micronucleus In Vitro and In Vivo Assay Outcomes](https://pmc.ncbi.nlm.nih.gov/articles/PMC10537630/), *Toxics*, 2023.
- [BARTSmiles: Generative Masked Language Models for Molecular Representations](https://doi.org/10.1021/acs.jcim.4c00512), *Journal of Chemical Information and Modeling*, 2024.

**Other AI publications and applications.**

- [AI/ML Modeling to Enhance the Capability of In Vitro and In Vivo Tests in Predicting Human Carcinogenicity](https://doi.org/10.1016/j.mrgentox.2025.503858), *Mutation Research/Genetic Toxicology and Environmental Mutagenesis*, 2025.
- [Consensus Modeling Strategies for Predicting Transthyretin Binding Affinity from Tox24 Challenge Data](https://pmc.ncbi.nlm.nih.gov/articles/PMC12175157/), *Chemical Research in Toxicology*, 2025.
- [Synthesis, in silico, and in vitro pharmacological evaluation of norbornenylpiperazine derivatives as potential ligands for nuclear hormone receptors](https://doi.org/10.7324/JAPS.2025.230239), *Journal of Applied Pharmaceutical Science*, 2025. The study applies Toxometris models to ADMET and toxicity prediction for the synthesized compounds.
- [Enhancing Chemical-Induced Human Carcinogenic Risk Evaluation through Advanced AI Technologies](https://doi.org/10.3390/proceedings2024102012), *Proceedings*, 2024.
- [Predictive, integrative, and regulatory aspects of AI-driven computational toxicology—Highlights of the German Pharm-Tox Summit (GPTS) 2024](https://doi.org/10.1016/j.tox.2024.153975), *Toxicology*, 2024. This review and conference report covers Toxometris's AI-driven computational-toxicology work alongside developments from other groups.

### ServiceTitan Armenia

**Organization.** ServiceTitan's Yerevan office conducts applied AI work and supports a multi-year research collaboration with the American University of Armenia. Arman Zakaryan, Director of AI Engineering at ServiceTitan Armenia, has represented the company in the collaboration, while AUA researchers Habet Madoyan and Aram Butavyan have led the university teams.

**How it uses AI.** Public research covers visual document retrieval and RAG, natural-language processing for matching duplicate catalog items, conversational job scoping, retrieval of similar historical cases, price estimation, and automated sales-estimate preparation.

**Recent AI publication and research projects.**

- [Visual RAG at Scale: Tile-Level Spatial Pooling for Efficient Multi-Vector Document Retrieval](https://doi.org/10.1145/3805712.3808383), SIGIR 2026 Demo Track, by Ara Yeroyan of ServiceTitan. The system reduces the storage and retrieval cost of multi-vector visual document embeddings through spatial pooling and two-stage retrieval without model retraining.
- ServiceTitan's first completed [AUA collaborative research project](https://newsroom.aua.am/2024/08/09/aua-completes-first-collaborative-project-with-servicetitan/) developed an NLP pipeline for identifying duplicate products across more than 10,000 customer catalogs.
- The current [ServiceTitan–AUA research program](https://cse.aua.am/erc/ongoing-projects/) develops ML models for job scoping and price estimation, including conversational clarification, retrieval of comparable past jobs, and generation of estimates and proposals.

### Amaros AI

**Organization.** Davit Shahnazaryan is associated with Amaros AI and YSU.

**How it uses AI.** The published work applies large language models to extract biomedical entities and relations and construct medical knowledge graphs from electronic medical records.

**Recent AI publication.** [Large Language Models for Biomedical Knowledge Graph Construction: Information extraction from EMR notes](https://arxiv.org/abs/2301.12473), 2023.

## Academic research groups that use AI within another field

### YSU Computational Materials Science Laboratory

**Primary field.** Computational materials science.

**How it uses AI.** The laboratory uses ML to search chemical and materials spaces, predict material properties, and accelerate candidate discovery. YSU explicitly describes this role in its [laboratory overview](https://www.ysu.am/en/node/91292).

**Relevant AI work.** A 2025 interdisciplinary project, [Detection of Superconducting Materials at Room Temperature and Atmospheric Pressure Conditions Using Chemistry-Informed Neural Networks](https://www.ysu.am/en/news/73876), combines materials data with chemistry-informed neural models. The laboratory also collaborates with the Functional Materials Group at the A.B. Nalbandyan Institute of Chemical Physics on ML-guided materials discovery. Recent joint and institute-led outputs include:

- [Accelerated composition optimization of hybrid perovskites via data-driven materials design, DFT calculations and synthesis](https://doi.org/10.1016/j.matdes.2025.114902), *Materials & Design*, 2025. Random-forest and gradient-boosting models screen candidate perovskite compositions, followed by DFT and experimental validation.
- [Finding Perovskite Composites With Preferable Features: Simple ML algorithms](https://openreview.net/forum?id=3JQDOxkDmG), AI4X 2025 Oral, by Gurgen Kolotyan, Arevik Asatryan, and Hayk Khachatryan of the A.B. Nalbandyan Institute of Chemical Physics.

**Funding.** The projects receive university and state research support. The AI4X work acknowledges Higher Education and Science Committee grant 22RL-012; a consolidated current breakdown is not public.

### Division of Quantum Technologies, A. Alikhanyan National Laboratory

**Primary field.** Theoretical and statistical physics, quantum technologies, and decision theory.

**Organization.** The [Division of Quantum Technologies](https://qtech.aanl.am/?p=5) grew from a research group formed around 2015 and became a formal AANL division in 2022. Armen Allahverdyan leads the group; its researchers include Arshak Hovhannisyan.

**How it uses AI.** One line of the division's work studies causal and probabilistic inference: how hidden common causes can be recovered from observed distributions, how such representations relate to nonnegative matrix factorization, and how they can support reliable decisions in cases such as Simpson's paradox.

**Relevant AI publications.**

- [Resolution of Simpson's paradox via the common cause principle](https://neurips.cc/virtual/2025/poster/120247), NeurIPS 2025, by Arshak Hovhannisyan and Armen Allahverdyan. The paper develops a latent-common-cause account of Simpson's paradox for discrete and Gaussian settings and studies its implications for probabilistic inference and decision-making.
- [Nonnegative Matrix Factorization and the Principle of the Common Cause](https://doi.org/10.1109/DSAA65442.2025.11248027), IEEE DSAA 2025, by Edvard Khalafyan, Armen Allahverdyan, and Arshak Hovhannisyan.
- [The most likely common cause](https://doi.org/10.1016/j.ijar.2024.109264), *International Journal of Approximate Reasoning*, 2024, on identifying latent common causes using generalized maximum likelihood.

**Funding.** The recent common-cause research acknowledges Armenian Science Committee grants, including 20TTAT-QTa003 and 21AG-1C038. The division also lists institutional and external project support; a consolidated current breakdown is not public.

### ICRANet-Armenia astrophysics research

**Primary field.** High-energy astrophysics and multiwavelength astronomy.

**How it uses AI.** ICRANet-Armenia researchers use gradient-boosted trees and neural networks to classify gamma-ray sources. They also train convolutional-neural-network surrogate models that reproduce computationally expensive physical simulations of blazar emission, enabling faster parameter estimation and fitting of observational data.

**Relevant AI publications.**

- [Gradient boosting decision trees classification of blazars of uncertain type in the fourth Fermi-LAT catalogue](https://doi.org/10.1093/mnras/stac3701), *Monthly Notices of the Royal Astronomical Society*, 2023, by Narek Sahakyan, Vahe Vardanyan, and Mher Khachatryan of ICRANet-Armenia.
- [Modeling Blazar Broadband Emission with a Convolutional Neural Network. I. Synchrotron Self-Compton Model](https://doi.org/10.3847/1538-4357/ad19cf), *The Astrophysical Journal*, 2024, with ICRANet-Armenia researchers Narek Sahakyan, Samvel Gasparyan, and Mher Khachatryan.
- [Modeling Blazar Broadband Emission with Convolutional Neural Networks. II. External Compton Model](https://doi.org/10.3847/1538-4357/ad5351), *The Astrophysical Journal*, 2024, with ICRANet-Armenia researchers Narek Sahakyan, Samvel Gasparyan, Vahe Vardanyan, and Mher Khachatryan.

**Funding.** The 2024 external-Compton study acknowledges Higher Education and Science Committee research project 23LCG-1C004 for the Armenia-based contributors.

### Institute of Mathematics of NAS RA and YSU scientific machine learning research

**Primary field.** Numerical analysis, partial differential equations, free-boundary problems, and mathematical modeling.

**Organization.** This research line is centered on mathematicians associated with the Institute of Mathematics of NAS RA and YSU rather than a formally named AI laboratory. [Avetik Arakelyan](https://scholar.google.com/citations?user=zMiBcbIAAAAJ) is a senior researcher at the Institute of Mathematics and a CSIE researcher. [Rafayel Barkhudaryan](https://scholar.google.com/citations?user=yJrwzxUAAAAJ) is YSU's Vice-Rector for Scientific Affairs, previously directed the Institute of Mathematics, and continues to publish with Institute researchers.

**How it uses AI.** The researchers study physics-informed neural networks as numerical solvers for nonlinear partial differential equations. Their work covers theoretical convergence guarantees, neural mixture-of-experts architectures for difficult free-boundary problems, and PINN-based numerical schemes for mean-field games.

**Relevant AI publications.**

- [Convergence of Physics-Informed Neural Networks for Fully Nonlinear PDEs](https://doi.org/10.1016/j.cam.2026.117740), *Journal of Computational and Applied Mathematics*, 2026, by Avetik Arakelyan and Rafayel Barkhudaryan. The paper proves convergence to viscosity solutions for a class of fully nonlinear second-order PDEs and demonstrates the method on Monge–Ampère and infinity-Laplacian equations.
- [Leveraging Dynamic Mixture of Experts in PINN for Bernoulli Free Boundary](https://doi.org/10.2139/ssrn.5336685), 2025 preprint, with Rafayel Barkhudaryan. It introduces a dynamic mixture-of-experts PINN architecture for scalar and system free-boundary problems.
- [A Mean-Field Game Model for Large-Scale Attrition in Attacker-Defender Systems](https://arxiv.org/abs/2604.02101), 2026 preprint, with Institute of Mathematics and CSIE researchers Avetik Arakelyan and Tigran Bakaryan. Its numerical method combines PINNs with Sinkhorn optimization to solve the resulting mean-field-game system.

**Funding.** The publications and public institutional profiles do not provide a consolidated funding breakdown for this research line.

### YSU Photonics and Artificial Intelligence Laboratory

**Primary field.** Photonics, optical imaging, and optical computing.

**How it uses AI.** The [laboratory](https://www.ysu.am/en/group/760) combines learning-based image reconstruction with optical systems, including imaging through turbulent or diffusive media; it also studies optical hardware and methods that may support future AI computing.

**Relevant AI work.** Its research program includes self-supervised dynamic learning for image transmission through unstable diffusive media, described in a [2025 laboratory seminar](https://www.ysu.am/en/faculty/525/seminars/73998), and the chemistry-informed neural-network project on superconducting materials noted above.

**Funding.** The laboratory receives university and state research support; a consolidated breakdown is not public.

### Center for Scientific Innovation and Education (CSIE) / NPUA

**Primary field.** Autonomous systems, robotics, optimization, and control.

**How it uses AI.** [CSIE](https://csiefoundation.am/en/about-us) combines learning-based perception and control with model-predictive, adaptive, distributionally robust, and game-theoretic control. Some projects advance safe learning for autonomous systems; others are control research without a learned model.

**Relevant AI work.** Public examples include:

- [Distributionally Robust Planning with L1 Adaptive Control](https://arxiv.org/abs/2603.28758), 2026, which addresses safety under distribution shift and model uncertainty.
- [Synergistic Simplex: Cooperative Runtime Assurance for Safety-Critical Autonomous Systems](https://csiefoundation.am/en/news/seminar-on-synergistic-simplex--cooperative-runtime-assurance-for-safety-critical-autonomous-systems), 2026, a project on coordinating learned autonomous-vehicle controllers with certified safety systems.

**Funding.** CSIE receives institutional and project-based research support; a consolidated current breakdown is not public.

### FAST ADVANCE drug-discovery group, L.A. Orbeli Institute of Physiology

**Primary field and institution.** This drug-discovery research group is hosted by the L.A. Orbeli Institute of Physiology of NAS RA and led remotely by [Ruben Abagyan](https://www.fast.foundation/en/staff/7094) of UC San Diego. FAST funded the project in 2023 under the title *DARTS: Discovery of New Drug Targets and First-in-class Chemical Modulators: from Diverse 3D-AI Data to Leads*.

**How it uses AI.** The project combines multimodal biological data, 3D-AI methods, computational modeling, ultra-large-scale virtual screening, and machine-learning refinement to identify drug targets, binding pockets, and candidate modulators.

**Relevant AI publication.** [Discovering Drug Leads by Ultrafast Docking Screens in Large Chemical Spaces and AI/ML Pipeline](https://doi.org/10.46991/JISEES.2025.SI1.184), *Journal of Innovative Science and Engineering Education*, 2025.

**Funding.** FAST's published project materials identify the original ADVANCE grant as funded by Joe Barnes; a current consolidated funding breakdown is not public.

### Armenian Bioinformatics Institute

**Primary field.** Bioinformatics, genomics, and computational biology.

**How it uses AI.** The [Armenian Bioinformatics Institute](https://www.abi.am/) applies statistical learning and ML to omics data, biological classification, and biomarker or trait prediction. Its [Binder Laboratory](https://oldsite.abi.am/research/research-labs/binder-lab/) explicitly lists machine learning of omics data as a method.

**Relevant AI publication.** A recent example is [Machine learning uncovers key genomic drivers of grapevine trait diversity](https://pmc.ncbi.nlm.nih.gov/articles/PMC12948125/), *PLOS Computational Biology*, 2026.

**Funding.** Institutional and project-based; a consolidated current breakdown is not public.

### Institute of Molecular Biology, NAS RA

**Primary field.** Molecular and cellular biology, genetics, and toxicology.

**How it uses AI.** IMB researchers use predictive ML and quantitative structure–activity relationship models to connect molecular representations with biological and toxicological outcomes. The [National Academy's institute profile](https://www.sci.am/orgsview.php?id=18&langid=2) describes a broader program that includes computational modeling; AI is one method within it.

**Collaboration with Toxometris and YerevaNN.** IMB contributes biological and toxicological expertise to a joint molecular-ML research line with Toxometris and YerevaNN. Publications carrying authors or affiliations from all three organizations include:

- [Improving VAE based molecular representations for compound property prediction](https://pmc.ncbi.nlm.nih.gov/articles/PMC9569108/), *Journal of Cheminformatics*, 2022.
- [Datasets Construction and Development of QSAR Models for Predicting Micronucleus In Vitro and In Vivo Assay Outcomes](https://pmc.ncbi.nlm.nih.gov/articles/PMC10537630/), *Toxics*, 2023.
- [BARTSmiles: Generative Masked Language Models for Molecular Representations](https://doi.org/10.1021/acs.jcim.4c00512), *Journal of Chemical Information and Modeling*, 2024.

**Funding.** State, institutional, and project-based; a consolidated breakdown for AI-related work is not public.

**Additional researcher.** [Andranik Khachatryan](https://scholar.google.com/citations?hl=en&user=dMue_ZMAAAAJ&view_op=list_works&sortby=pubdate) is a Machine Learning Specialist at [Envoy Media Group](https://www.envoymediagroup.com/about/leadership/), where he works on computer vision, NLP, recommender systems, and production ML. His recent academic publications include [Coevolution of reproducers and replicators at the origin of life and the conditions for the origin of genomes](https://pmc.ncbi.nlm.nih.gov/articles/PMC10083607/), *PNAS*, 2023, and [Optimal Alphabet for Single Text Compression](https://doi.org/10.1016/j.ins.2022.10.104), *Information Sciences*, 2023.

## Overall picture

Armenia's active academic AI research includes the YSU Machine Learning Research Group / YerevaNN, CAST's Machine Learning Research Group at RAU, the YSU Artificial Intelligence Laboratory, the AUA/FAST ADVANCE Data-science Research Group, AUA Computer Vision and Medical Imaging Research, and the new M3L laboratory at the NAS RA Institute of Mechanics. Industrial research teams at Picsart, NVIDIA Armenia, Metric, Deep Origin, Denovo Sciences, Toxometris, ServiceTitan, and Amaros also publish or release public research outputs.

YSU is emerging as Armenia's leading institutional center for AI research because it combines several research groups with the national GPU cluster and substantial undergraduate, master's, and school-level education programs. This concentration creates a stronger base for connecting students, supervisors, and compute than any one element would provide on its own.

Even so, NeurIPS-level research output remains very limited and depends on very few groups and supervisors. The number and size of research laboratories, their output at NeurIPS and comparable top-tier venues, and their capacity to supervise PhD and other students at that level remain disproportionately low relative to the country's education pipeline, computing infrastructure, and the priority given to AI. Expanding this advanced research layer is the central requirement for a stronger national research system.

Beyond these AI-focused groups, researchers in materials science, theoretical physics, astrophysics, numerical mathematics, photonics, autonomous control, bioinformatics, drug discovery, and molecular biology use ML in active scientific programs. This layer connects Armenia's AI capacity to research in the physical and life sciences and would benefit from additional support.

# AI Infrastructure and Compute

**Snapshot date:** August 2026

**Focus:** Armenia's three principal GPU-compute platforms: the public research cluster at Yerevan State University, Eleveight AI's facility in Gagarin, and Firebird AI's much larger commercial facility near Hrazdan.

---

## Infrastructure snapshot

Armenia now has public research compute at YSU, a private B300 cluster at Eleveight AI, and a hyperscale commercial B200 cluster at Firebird. Together they account for **6,736 operational GPUs**, although the hardware generations, owners, and access models differ substantially.

| Platform | Operational capacity | Status and expansion | Role for Armenia |
|---|---:|---|---|
| **YSU Datacenter** | 72 NVIDIA H100 + 8 A100 | Operational since Jan 2026 | Government-funded compute for Armenian research groups |
| **Eleveight AI** | 512 NVIDIA B300 | Opened Jun 2026; another 512 B300s targeted for Jan 2027, followed by thousands of Vera Rubin GPUs in late 2027 | Private commercial infrastructure; future deployments will provide the company's planned 20% allocation for Armenian universities, research centers, and nonprofits |
| **Firebird AI** | 6,144 NVIDIA B200 | Opened Aug 2026; 60,000+ Vera Rubin GPUs targeted for summer 2027 | Hyperscale commercial infrastructure, mostly serving large U.S.-based customers; the Armenian government has contracted for roughly 3% of phase-one capacity |

Future deployments are shown as targets and are not included in the operational total.

---

## Yerevan State University

[YSU Datacenter](https://www.ysu.am/compute) has a unified **64-H100 supercomputer**, a separate **8-H100** system, and an **8-A100** system. The infrastructure was funded by the Armenian government and is operated primarily for machine learning, computational physics, materials science, and other compute-intensive research.

[Armenian scientific teams can receive free or nominal-fee access](https://www.ysu.am/en/news/90809) according to research priority. This makes YSU the country's main public research-compute platform.

The [cluster monitoring report](https://hrant-khachatrian.github.io/compute-usage-reports/report-2026-apr-aug.html) records **164,716 allocated GPU-hours from 1 April through 18 August 2026**, equal to **79.3% of possible capacity** over the reporting window. The denominator assumes 62 H100 GPUs were continuously available. This is an intensity measure, not hardware-level device utilization or computational efficiency.

The system supports fine-tuning, distributed training, hyperparameter studies, and moderate-scale foundation-model research. Its main value is giving Armenian research groups and students sustained access to modern GPUs without requiring commercial cloud budgets.

---

## Eleveight AI

[Eleveight AI officially opened its Gagarin AI Factory](https://armenpress.am/en/article/1251654) on **1 June 2026** with **512 NVIDIA B300 GPUs**. The company reports a **$120 million** first-phase investment and says the facility was built to [NVIDIA reference-architecture standards](https://www.prnewswire.com/news-releases/eleveight-ai-launches-armenias-first-blackwell-powered-ai-factory-302783083.html).

[Most of the initial 512-GPU capacity has been sold](https://tech.news.am/eng/news/7435/eleveight-ai-expands-armenias-first-artificial-intelligence-factory.html). Eleveight AI is targeting another **512 B300 GPUs by January 2027**, followed by **thousands of NVIDIA Vera Rubin GPUs in late 2027**.

Eleveight AI has committed 20% of its compute to Armenian universities, research centers, and nonprofit initiatives. Because most of the current 512-GPU deployment has already been sold, this research allocation will come from future deployments.

The Gagarin location allows natural cooling during most of the year. Eleveight AI also owns solar-generation assets supporting the facility.

---

## Firebird AI

[Firebird's AI factory near Hrazdan opened in August 2026](https://blogs.nvidia.com/blog/firebird-ai-factory-armenia-blackwell-rubin-dsx/) with [**6,144 NVIDIA B200 GPUs**](https://armenpress.am/ru/article/1256630) and 18 MW of power capacity. The company reports up to **110.6 exaflops of FP4 tensor performance**; this AI-oriented figure is not directly comparable with the FP64 measurements used to rank conventional scientific supercomputers.

Phase one represents a **$500 million** investment, including a [$300 million syndicated financing package](https://hightech.gov.am/hy/tegekatvakan-kentron/ayl/norutyunner/firebird-ai-300) from six Armenian financial institutions. Most of the cluster has been sold to large U.S.-based customers.

The Armenian government has [contracted for **$25 million of compute over five years**](https://hightech.gov.am/en/tegekatvakan-kentron/ayl/norutyunner/25-mln), corresponding to roughly **3% of the phase-one cluster**. The capacity is intended for startups, research groups, educational institutions, individual specialists, and public-sector projects through the Artificial Intelligence Virtual Institute.

Firebird is targeting **60,000+ NVIDIA Vera Rubin GPUs in summer 2027** for its next expansion phase.

---

## Bottom line

Armenia's compute capacity is growing faster than the local capacity to use it for high-quality research. The country needs more research labs and more ambitious projects to create sufficient demand for this infrastructure.

Government investment in the YSU supercomputer and the Firebird compute contract provides the hardware and access needed for that growth. The main bottleneck is now funding research teams: recruiting and retaining researchers, developing strong projects, and building new labs capable of turning compute into publications, models, scientific results, and companies.

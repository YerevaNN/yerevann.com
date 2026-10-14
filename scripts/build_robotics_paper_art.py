"""Build editable SVG and WebP schematics for the robotics publication cards.

Requires Pillow. Diagrams illustrate concepts, not measured results.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from html import escape
import math, json, random

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / 'robotics-paper-art'
OUT.mkdir(parents=True, exist_ok=True)
P, T, R, G, K = '#6458c3', '#32b0ad', '#e6495b', '#e8b546', '#171722'
PALE, LINE = '#f5f6fa', '#d8d9e2'
FONT = Path('C:/Windows/Fonts')

class Canvas:
    def __init__(self):
        self.im = Image.new('RGB', (1200,800), PALE)
        self.d = ImageDraw.Draw(self.im)
        self.svg = ['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">', f'<rect width="1200" height="800" fill="{PALE}"/>']
    def rect(self,x,y,w,h,fill='white',stroke=None,r=0,width=3):
        self.d.rounded_rectangle((x,y,x+w,y+h),r,fill,stroke,width)
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke or "none"}" stroke-width="{width}"/>')
    def line(self,pts,color=P,width=5):
        self.d.line(pts,fill=color,width=width,joint='curve')
        self.svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in pts)}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')
    def circle(self,x,y,r,fill=P,stroke=None,width=3):
        self.d.ellipse((x-r,y-r,x+r,y+r),fill,stroke,width)
        self.svg.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke or "none"}" stroke-width="{width}"/>')
    def poly(self,pts,fill=P):
        self.d.polygon(pts,fill=fill)
        self.svg.append(f'<polygon points="{" ".join(f"{x},{y}" for x,y in pts)}" fill="{fill}"/>')
    def text(self,x,y,s,size=28,color=K,bold=False,center=False):
        font=ImageFont.truetype(str(FONT/('arialbd.ttf' if bold else 'arial.ttf')),size)
        if center: x-=self.d.textlength(s,font=font)/2
        self.d.text((x,y),s,font=font,fill=color)
        self.svg.append(f'<text x="{x}" y="{y+size*.92}" font-family="Arial, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{color}">{escape(s)}</text>')
    def arrow(self,x1,y1,x2,y2,color=P,width=5):
        self.line([(x1,y1),(x2,y2)],color,width)
        a=math.atan2(y2-y1,x2-x1)
        self.poly([(x2,y2),(x2-18*math.cos(a-.5),y2-18*math.sin(a-.5)),(x2-18*math.cos(a+.5),y2-18*math.sin(a+.5))],color)
    def finish(self,slug,title,subtitle):
        self.rect(70,580,1060,146,'white',LINE,28,2)
        size=52
        while self.d.textlength(title,font=ImageFont.truetype(str(FONT/'arialbd.ttf'),size))>990: size-=1
        self.text(105,604,title,size,bold=True)
        self.text(107,675,subtitle,29,'#5b596b')
        self.im.save(OUT/(slug+'.webp'),'WEBP',quality=92,method=6)
        (OUT/(slug+'.svg')).write_text('\n'.join(self.svg+['</svg>']),encoding='utf-8')

def panel(c): c.rect(90,90,1020,420,'white',LINE,32,2)
def box(c,x,y,w,h,label,color=P):
    c.rect(x,y,w,h,color,None,18); c.text(x+w/2,y+h/2-17,label,28,'white',True,True)
def cross(c,x,y,color=R): c.line([(x-12,y-12),(x+12,y+12)],color,5); c.line([(x-12,y+12),(x+12,y-12)],color,5)
def tiles(c,x,y,n=4,size=58,selected=None,mode='map'):
    for i in range(n*n):
        xx=x+(i%n)*(size+8); yy=y+(i//n)*(size+8)
        color=[P,T,R,G][i%4]
        c.rect(xx,yy,size,size,'#efedf8',color if selected is not None and i in selected else LINE,6,3)
        if mode=='map':
            c.rect(xx+8,yy+8,size*.30,size*.35,color,None,2)
            c.rect(xx+size*.52,yy+size*.45,size*.32,size*.39,color,None,2)
        else:
            c.circle(xx+size/2,yy+size/2,size*.2,color)
def floor(c,x,y,size=220,heat=False,sparse=False):
    if heat:
        cell=size/11
        for j in range(11):
            for i in range(11):
                distance=math.hypot(i-2,j-3)
                color=R if distance<2 else G if distance<4 else T if distance<7 else '#aaa4db'
                c.rect(x+i*cell,y+j*cell,cell+1,cell+1,color)
    else: c.rect(x,y,size,size,'#efedf8',K,0,5)
    walls=[[(x,y),(x+size,y),(x+size,y+size),(x,y+size),(x,y)],[(x+size*.48,y),(x+size*.48,y+size*.40)],[(x+size*.48,y+size*.60),(x+size*.48,y+size)],[(x,y+size*.48),(x+size*.27,y+size*.48)],[(x+size*.65,y+size*.48),(x+size,y+size*.48)]]
    for w in walls: c.line(w,K,5)
    c.circle(x+size*.22,y+size*.30,8,R)
    if sparse:
        for px,py in [(0.2,.3),(.72,.25),(.8,.75),(.3,.8)]: c.circle(x+size*px,y+size*py,10,T)
def city(c,x,y,size=260,rays=False,target=False):
    c.rect(x,y,size,size,'#f1f0f9',LINE,8,2)
    for i,(bx,by,bw,bh) in enumerate([(0.10,.13,.25,.25),(.58,.10,.27,.30),(.15,.62,.20,.23),(.53,.56,.34,.26)]):
        c.rect(x+bx*size,y+by*size,bw*size,bh*size,'#c6c0e9',None,4)
    if rays:
        c.line([(x+20,y+size*.48),(x+size*.48,y+size*.22),(x+size*.85,y+size*.48)],T,4)
        c.line([(x+20,y+size*.48),(x+size*.45,y+size*.86),(x+size*.85,y+size*.48)],G,4)
        c.circle(x+20,y+size*.48,10,P)
    if target: c.circle(x+size*.85,y+size*.48,10,R)
def ship(c,x,y,size=90,color=T,radar=False):
    c.rect(x-size*.75,y-size*.65,size*1.5,size*1.3,'#efedf8' if not radar else '#e4e3ec',None,12)
    c.poly([(x-size*.42,y-size*.16),(x+size*.30,y-size*.16),(x+size*.48,y),(x+size*.30,y+size*.16),(x-size*.42,y+size*.16)],color)
    for i in range(4): c.rect(x-size*.30+i*size*.14,y-size*.10,size*.10,size*.20,'white',None,1)
    if radar:
        for j in range(4): c.line([(x-size*.5,y-size*.35+j*size*.23),(x+size*.5,y-size*.35+j*size*.23)],'#c3c0d6',2)
def drone(c,x,y,s=1):
    for dx,dy in [(-32,-24),(32,-24),(-32,24),(32,24)]:
        c.line([(x,y),(x+dx*s,y+dy*s)],P,7)
        c.circle(x+dx*s,y+dy*s,18*s,'#ebe8f8',P,4)
    c.rect(x-17*s,y-12*s,34*s,24*s,T,None,7)
def route(c,x,y,size=250,history=False):
    city(c,x,y,size)
    points=[(x+size*.13,y+size*.48),(x+size*.45,y+size*.48),(x+size*.45,y+size*.88),(x+size*.92,y+size*.88)]
    c.line(points,T,7); c.arrow(*points[-2],*points[-1],T,7)
    c.circle(x+size*.92,y+size*.88,12,R); drone(c,x+size*.45,y+size*.48,.7)
    if history:
        for i in range(3): c.circle(x+size*(.16+i*.10),y+size*.48,5,P)
def satellite(c,x,y,s=1):
    c.rect(x-65*s,y-24*s,42*s,48*s,P,None,4); c.rect(x+23*s,y-24*s,42*s,48*s,P,None,4); c.rect(x-19*s,y-28*s,38*s,56*s,T,None,6)
    c.line([(x,y+32*s),(x-25*s,y+55*s)],K,3)
def bird(c,x,y,color=P,back=T):
    c.rect(x-60,y-47,120,94,'#edf5f4' if back==T else '#f9eded',None,10)
    c.poly([(x-35,y+25),(x+20,y+25),(x+20,y+40),(x-35,y+40)],back)
    c.circle(x,y,19,color); c.circle(x+21,y-14,12,color); c.poly([(x+30,y-16),(x+46,y-11),(x+30,y-7)],G)
def samples(c,x,y,kind=0):
    rng=random.Random(18+kind)
    for i in range(18):
        px=x+rng.randrange(150); py=y+rng.randrange(190)
        color=P if i<9 else T
        if kind: color=R if i<9 else G
        c.circle(px,py,8,color)

def art(c,kind):
    panel(c)
    if kind in ['synthetic-radio','vit-radio','sparse-radio']:
        floor(c,145,160,220,sparse=kind=='sparse-radio'); c.arrow(395,275,480,275)
        if kind=='synthetic-radio':
            for j in range(3): c.rect(505+j*10,185+j*12,175,140,'#eeebf8',P,12)
            c.text(605,370,'Pretrain',27,P,True,True)
        elif kind=='vit-radio':
            tiles(c,490,172,3,53,mode='features'); c.text(585,390,'ViT',27,P,True,True)
        else:
            c.line([(500,205),(530,205),(530,330),(610,330),(610,205),(680,205)],P,15)
            c.text(590,390,'U-Net',27,P,True,True)
        c.arrow(710,275,775,275); floor(c,815,160,220,heat=True)
        c.text(255,424,'Layouts' if kind!='sparse-radio' else 'Sparse samples',25,K,center=True); c.text(925,424,'Radio map',25,K,center=True)
    elif kind=='density':
        tiles(c,160,160,4,51); c.arrow(420,270,520,270)
        tiles(c,570,175,3,53); c.arrow(755,230,965,230,T); c.arrow(965,330,755,330,T); c.line([(965,230),(990,270),(965,330)],T,5)
        c.text(275,426,'Unique images',28,P,True,True); c.text(760,426,'Repeated views',28,T,True,True)
    elif kind in ['shipcross','hoss','cosmos']:
        if kind=='cosmos':
            for y in [205,365]:
                ship(c,225,y,80,T); c.arrow(310,y,425,y); ship(c,515,y,80,P,True)
            c.arrow(610,285,690,285); box(c,740,180,290,85,'Known identity',T); box(c,740,340,290,85,'Unknown query',R)
        elif kind=='shipcross':
            ship(c,280,285,140,P,True); ship(c,870,285,140,T); c.arrow(460,270,690,270); c.arrow(690,310,460,310,T)
            c.text(280,415,'SAR',30,P,True,True); c.text(870,415,'Multispectral',30,T,True,True); c.text(575,355,'Same vessel',27,K,center=True)
        else:
            ship(c,250,285,110,T); c.arrow(395,285,485,285)
            for i in range(3):
                ship(c,600+i*170,250,70,P if i==1 else '#b7b2d1',True)
            c.circle(770,250,77,'#ffffff',T,4); ship(c,770,250,70,P,True)
            c.text(770,370,'Gallery match',28,T,True,True); c.text(250,425,'Query',26,P,True,True)
    elif kind=='mixed-contrastive':
        ship(c,235,225,80,T); ship(c,235,370,80,P,True); c.arrow(350,285,455,285)
        for row in range(6):
            for col in range(6):
                color=LINE if row==col else T if abs(row-col)==3 else '#eeeaf9'
                c.rect(525+col*48,150+row*48,42,42,color,None,5)
        c.text(670,450,'Joint similarity matrix',28,P,True,True)
        c.text(895,195,'RGB',27,T,True); c.text(895,310,'SAR',27,P,True)
    elif kind in ['map-history','map-navigation','small-vlm']:
        if kind=='small-vlm':
            for i in range(2):
                c.rect(145+i*22,170+i*50,255,170,'#eeebf8',LINE,12)
                c.rect(175+i*22,205+i*50,65,100,'#c5bfe7',None,3)
                c.rect(280+i*22,230+i*50,70,75,'#c5bfe7',None,3)
                c.line([(160+i*22,320+i*50),(385+i*22,320+i*50)],T,4)
        else: route(c,155,155,265,history=kind=='map-history')
        c.arrow(450,285,525,285)
        box(c,555,205,190,145,'VLM',P); c.arrow(775,285,855,285); drone(c,970,285,1.5)
        if kind=='map-history':
            for i in range(4): c.rect(530+i*62,400,53,42,'#e9e6f7',P,5)
            c.text(650,454,'Flight history',24,P,True,True)
        elif kind=='map-navigation':
            c.text(670,405,'Map + instruction',25,P,True,True)
        else:
            c.text(670,405,'View + action history',25,P,True,True)
    elif kind in ['rf-alignment','ray-limits','sim-real','nlos','uncertainty','rf-map','rf-reconstruction']:
        if kind in ['rf-alignment','sim-real']:
            city(c,150,155,235,True,True); city(c,815,155,235,True,True); c.arrow(415,265,490,265); c.arrow(710,265,785,265)
            box(c,505,185,185,155,'Align' if kind=='rf-alignment' else 'Pretrain',P)
            c.text(265,426,'Simulation',27,P,True,True); c.text(930,426,'Real data',27,T,True,True)
        elif kind=='ray-limits':
            city(c,165,160,245,True,True); city(c,795,160,245,True,True)
            c.line([(495,230),(525,230),(560,340),(600,205),(635,310),(695,310)],P,6)
            c.line([(495,310),(530,280),(570,300),(615,250),(655,235),(695,275)],R,6)
            c.text(600,430,'Simulation / measurement',26,K,center=True)
        elif kind=='nlos':
            city(c,395,140,300,True,True); c.text(545,465,'Reflected radio paths',28,P,True,True)
            c.line([(170,330),(210,165),(250,330)],P,8); c.line([(180,295),(240,295)],P,5)
        elif kind=='uncertainty':
            city(c,155,160,250,True); c.arrow(435,280,540,280); city(c,610,140,340)
            for x,y,r,col in [(710,265,40,'#d5eee9'),(875,285,32,'#e4dff6'),(770,395,22,'#f9e6e9')]: c.circle(x,y,r,col); c.circle(x,y,8,T)
            c.text(780,460,'Candidate locations',26,P,True,True)
        elif kind=='rf-map':
            city(c,145,170,220); c.text(255,435,'Map + RF',27,P,True,True)
            for x,y in [(170,360),(320,355),(315,200)]: c.circle(x,y,9,T)
            c.arrow(395,280,495,280); box(c,525,195,160,150,'ViT',P); c.arrow(715,280,795,280); city(c,825,170,220)
            c.text(935,435,'Refined map',27,T,True,True)
        else:
            city(c,170,160,250,True); c.arrow(465,285,650,285); city(c,760,160,250)
            c.text(295,435,'Radio paths',28,P,True,True); c.text(885,435,'Reconstruction',28,T,True,True)
    elif kind=='geocross':
        for i in range(3):
            x=175+i*300; satellite(c,x+90,150,.7)
            for j,col in enumerate([P,T,R,G][:i+2]): c.rect(x+j*12,230+j*14,155,145,'#f0eef9',col,8,4)
            c.text(x+85,430,['Seen bands','New bands','More bands'][i],26,[P,T,R][i],True,True)
        c.arrow(410,315,490,315); c.arrow(710,315,790,315)
    elif kind=='sat-pretrain':
        tiles(c,155,190,3,62,mode='features'); tiles(c,820,190,3,62)
        c.arrow(410,290,500,290); box(c,520,220,155,120,'Encoder',P); c.arrow(710,290,795,290)
        c.text(255,430,'General images',27,P,True,True); c.text(925,430,'Satellite tasks',27,T,True,True)
    elif kind=='specialization':
        tiles(c,160,155,4,57,selected=[1,5,9,13]); c.arrow(460,285,550,285)
        for i in range(4): c.rect(600+i*22,210+i*18,185,150,'#eeebf8',T,12,4)
        c.text(292,450,'Full dataset',28,P,True,True); c.text(765,450,'Selected subset',28,T,True,True)
    elif kind=='iot':
        points=[(210,180),(340,240),(195,350),(365,390),(475,185)]
        for a,b in [(0,1),(0,2),(1,2),(1,3),(1,4)]: c.line([points[a],points[b]],P,5)
        for i,(x,y) in enumerate(points): c.circle(x,y,24,[P,T,R,G,P][i])
        c.arrow(510,285,600,285); box(c,625,205,180,150,'Cooja',P); c.arrow(840,285,895,285)
        for i in range(3): c.rect(930+i*15,225+i*18,80,115,'#edeaf9',T,8)
    elif kind=='local-features':
        tiles(c,165,160,4,53,mode='features'); c.arrow(445,275,555,275)
        for i,h in enumerate([65,120,90,185,95,130,230]): c.rect(595+i*55,400-h,32,h,P if i!=6 else R,None,5)
        c.text(283,440,'Image patches',28,P,True,True); c.text(780,440,'Local representations',28,P,True,True)
    elif kind in ['spurious-context','disentangle']:
        bird(c,215,205,P,T); bird(c,215,365,P,R); c.arrow(325,285,440,285)
        if kind=='spurious-context':
            for i,lab in enumerate(['x','y','x','y','?']): box(c,475+i*105,250,80,70,lab,[P,T,P,T,R][i])
            c.text(720,405,'Context examples + query',28,P,True,True)
        else:
            box(c,485,180,175,110,'Encoder',P); c.arrow(690,235,760,235)
            box(c,785,155,225,70,'Core',T); box(c,785,255,225,70,'Spurious',R); box(c,785,355,225,70,'Other',P)
    elif kind=='robustness':
        for i in range(3):
            tiles(c,175+i*310,220,2,75)
            if i==1:
                for j in range(6): c.line([(480,245+j*22),(645,235+j*22)],'#c4bbdf',5)
            if i==2:
                for j in range(20): c.circle(795+(j*29)%160,225+(j*43)%165,3,R)
            c.text(253+i*310,435,['Original','Blur','Noise'][i],28,P,True,True)
    elif kind=='orchard':
        for row in range(3):
            for col in range(5):
                x=220+col*160; y=170+row*105
                c.line([(x,y),(x,y+28)],K,5); c.circle(x,y-5,28,'#cce8e0'); c.circle(x+12,y-10,19,T)
                if row==1: c.circle(x-35,y+38,8,P)
        c.line([(185,430),(1000,430)],P,8)
        for i in range(5): c.line([(220+i*160,430),(220+i*160,300)],P,4)
    elif kind in ['domain-failures','domain-shift']:
        for i in range(3):
            x=170+i*320; c.rect(x,160,235,235,'#f3f1fa',LINE,16)
            samples(c,x+40,185,i if kind=='domain-failures' else 1)
            if kind=='domain-shift':
                c.text(x+80,230,str(2+i),74,[P,T,R][i],True)
            c.text(x+117,430,['Train','Shifted test','Unseen domain'][i],25,P,True,True)
    elif kind=='semi-supervised':
        for i in range(12):
            x=185+(i%3)*60; y=190+(i//3)*60; c.circle(x,y,15,P if i==0 else T if i==11 else '#dbd8eb')
        c.arrow(390,285,495,285); box(c,515,210,175,135,'Learn',P); c.arrow(725,285,805,285)
        for i in range(12):
            x=875+(i%3)*48; y=190+(i//3)*60; c.circle(x,y,15,P if i<6 else T)
        c.text(255,445,'Few labels',28,P,True,True); c.text(935,445,'Classify',28,T,True,True)
    else: raise ValueError(kind)

SPECS = [
('synthetic-radio-pretraining','Synthetic Radio Pretraining','Cheap simulation for indoor radio-map prediction','synthetic-radio'),
('data-density-scaling','Data Density Scaling','Unique images and repeated views','density'),
('cosmos-reid','COSMOS-ReID','Open-world object matching across sensors','cosmos'),
('shipcross-id','ShipCross-ID','Matching vessels across multispectral and SAR imagery','shipcross'),
('mixed-contrastive-pretraining','Mixed Contrastive Pretraining','Joint RGB-SAR representation learning','mixed-contrastive'),
('map-grounding-history','Map Grounding + History','Aerial navigation with maps and past observations','map-history'),
('rf-distribution-alignment','RF Distribution Alignment','Calibration and sim-to-real positioning','rf-alignment'),
('ray-tracing-limitations','Ray-Tracing Limitations','Comparing simulated and measured urban RF signals','ray-limits'),
('geocrossbench','GeoCrossBench','Generalizing to new satellite bands','geocross'),
('mapradioformer','MapRadioFormer','Fusing radio signals and spatial maps','rf-map'),
('in-context-spurious','In-Context Learning','Learning from context under spurious correlations','spurious-context'),
('hoss-bench','HOSS-Bench','Open-set RGB-SAR vessel re-identification','hoss'),
('satellite-pretraining','Satellite Pretraining','Do satellite tasks need specialized encoders?','sat-pretrain'),
('navigation-maps','Learning to Read Maps','Teaching vision-language models to navigate','map-navigation'),
('vit-radio-map','ViTs for Radio Maps','Indoor pathloss prediction from floor plans','vit-radio'),
('data-specialization','Data Specialization','Selecting remote-sensing images for self-supervision','specialization'),
('sparse-radio-unet','Sparse Radio Measurements','Physics-informed pathloss prediction with U-Net','sparse-radio'),
('rf-synthetic-pretraining','Sim-to-Real RF Localization','Large-scale synthetic pretraining for real signals','sim-real'),
('cooja-iot-datasets','Synthetic IoT Datasets','Scalable network simulation with Cooja','iot'),
('small-vlm-navigation','Small VLMs for Navigation','Fine-tuning aerial agents with observation history','small-vlm'),
('single-base-station-nlos','Single-Station NLOS','Positioning from reflected radio signals','nlos'),
('local-vit-representations','Local ViT Representations','Understanding image patches and high-variance features','local-features'),
('rf-environment-reconstruction','RF Environment Reconstruction','Mapping buildings from radio propagation paths','rf-reconstruction'),
('remote-sensing-robustness','Remote-Sensing Robustness','Evaluating models under image distribution shifts','robustness'),
('spurious-feature-disentangling','Disentangling Spurious Features','Separating core features from shortcut signals','disentangle'),
('nlos-uncertainty','NLOS Localization + Uncertainty','Input representations and candidate positions','uncertainty'),
('orchard-networked-sensors','Networked Orchard Sensors','Sensing and irrigation in an apple orchard','orchard'),
('domain-generalization-failures','Domain Generalization','Studying model failure under distribution shifts','domain-failures'),
('semi-supervised-survey','Semi-Supervised Learning','Image classification with labeled and unlabeled data','semi-supervised'),
('class-dependent-domain-shift','Class-Dependent Domain Shift','Robust classification when domains depend on labels','domain-shift'),
]

if __name__ == '__main__':
    previous = {r['slug']: r for r in json.loads((OUT/'manifest.json').read_text(encoding='utf-8'))} if (OUT/'manifest.json').exists() else {}
    manifest=[]
    for slug,title,subtitle,kind in SPECS:
        c=Canvas(); art(c,kind); c.finish(slug,title,subtitle)
        record={'slug':slug,'title':title,'subtitle':subtitle,'concept':kind,'image':f'/assets/robotics-paper-art/{slug}.webp','source':f'/assets/robotics-paper-art/{slug}.svg','alt':f'{title}: {subtitle.rstrip(".?")}. Conceptual research illustration.'}
        for key in ['paperTitle','paperLinks']:
            if key in previous.get(slug,{}): record[key]=previous[slug][key]
        manifest.append(record)
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    sheet=Image.new('RGB',(1800,1440),PALE)
    for i,record in enumerate(manifest):
        with Image.open(OUT/(record['slug']+'.webp')) as thumbnail:
            sheet.paste(thumbnail.resize((360,240),Image.Resampling.LANCZOS),((i%5)*360,(i//5)*240))
    sheet.save(OUT/'contact-sheet.webp','WEBP',quality=92,method=6)
    print(f'Created {len(manifest)} SVG schematics and WebP thumbnails in {OUT}')

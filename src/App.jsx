import React, { useMemo, useState } from 'react';
import { presentes } from './lista-presentes';
import RSVP from './components/RSVP';
import Hero from './components/Hero';
import Footer from './components/Footer';
import GiftsSection from './components/GiftSection';
import { siteConfig } from './utils/config';



export default function App() {
  return (
    <div className="text-slate-900 bg-white font-sans">
      <Hero names={siteConfig.couple.names} dateLabel={siteConfig.couple.dateLabel} cityArea={siteConfig.couple.cityArea} />
      <RSVP pixKey={siteConfig.pixKey} mapsHref={siteConfig.mapsHref} whatsappHref={siteConfig.whatsappHref} />
      <GiftsSection gifts={presentes} />
      <Footer names={siteConfig.couple.names} dateLabel={siteConfig.couple.dateLabel} />
    </div>
  );
}

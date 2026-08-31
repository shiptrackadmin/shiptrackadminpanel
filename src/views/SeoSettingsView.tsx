import React, { useState } from 'react';
import { SeoConfig } from '../types';
import {
  Globe,
  Copy,
  Check,
  RefreshCw,
  FileCode,
  Save,
  CheckCircle2,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface SeoSettingsViewProps {
  seoConfig: SeoConfig;
  onUpdateSeoConfig: (updated: Partial<SeoConfig>) => void;
  onShowToast: (title: string, message?: string) => void;
}

export const SeoSettingsView: React.FC<SeoSettingsViewProps> = ({
  seoConfig,
  onUpdateSeoConfig,
  onShowToast,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [robotsTxt, setRobotsTxt] = useState(seoConfig.robotsTxt);
  const [metaTitleSuffix, setMetaTitleSuffix] = useState(seoConfig.metaTitleSuffix);
  const [canonicalEnabled, setCanonicalEnabled] = useState(seoConfig.canonicalEnabled);
  const [globalMetaDescription, setGlobalMetaDescription] = useState(
    seoConfig.globalMetaDescription
  );

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(seoConfig.sitemapUrl);
    setCopiedUrl(true);
    onShowToast('URL Sitemap Copiato', 'Link sitemap copiato negli appunti.');
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  const handleRegenerateSitemap = () => {
    const nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    onUpdateSeoConfig({ sitemapLastGenerated: nowUtc });
    onShowToast('Sitemap XML Rigenerato', `Indice sitemap aggiornato al ${nowUtc}`);
  };

  const handleUpdateRobots = () => {
    const nowUtc = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';
    onUpdateSeoConfig({
      robotsTxt,
      robotsLastUpdated: nowUtc,
    });
    onShowToast('Robots.txt Salvato', 'Direttive crawler aggiornate con successo.');
  };

  const handleSaveDefaults = () => {
    onUpdateSeoConfig({
      metaTitleSuffix,
      canonicalEnabled,
      globalMetaDescription,
    });
    onShowToast('Default Meta Salvati', 'Titoli fallback e canonical aggiornati.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Configurazioni SEO & Indicizzazione
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Controlla l'indicizzazione dei motori di ricerca, la generazione della sitemap e le regole meta globali.
        </p>
      </div>

      {/* SECTION 1: XML Sitemap Generator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Generatore Sitemap XML</h2>
            <p className="text-xs text-slate-500">
              Struttura sitemap XML automatizzata inviata a Google Search Console e Bing Webmaster.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Endpoint Sitemap Pubblico
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={seoConfig.sitemapUrl}
                readOnly
                className="flex-1 px-3.5 py-2.5 bg-slate-100 border border-slate-300 rounded-xl text-sm font-mono text-slate-800 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Copiato!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copia URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500">
              Ultima Generazione:{' '}
              <span className="font-mono font-semibold text-slate-800">
                {seoConfig.sitemapLastGenerated}
              </span>
            </div>

            <button
              type="button"
              onClick={handleRegenerateSitemap}
              className="px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#2563eb] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Rigenera Sitemap</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Robots.txt Rules File */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">File Robots.txt</h2>
            <p className="text-xs text-slate-500">
              Configura i parametri di indicizzazione dei crawler e le esclusioni di percorsi privati.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Direttive Robots.txt
            </label>
            <textarea
              rows={8}
              value={robotsTxt}
              onChange={(e) => setRobotsTxt(e.target.value)}
              className="w-full p-4 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-500">
              Ultimo aggiornamento:{' '}
              <span className="font-mono font-semibold text-slate-800">
                {seoConfig.robotsLastUpdated}
              </span>
            </div>

            <button
              type="button"
              onClick={handleUpdateRobots}
              className="px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#2563eb] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <Save className="w-4 h-4" />
              <span>Aggiorna Robots.txt</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: Global Meta Defaults */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Default Globali Titolo & Meta</h2>
            <p className="text-xs text-slate-500">
              Fallback applicati quando i metadati specifici dell'articolo sono vuoti.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Default Meta Title Suffix */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Suffisso Titolo Meta Default
            </label>
            <input
              type="text"
              value={metaTitleSuffix}
              onChange={(e) => setMetaTitleSuffix(e.target.value)}
              placeholder="es. | ShipTrack Parcel Intelligence"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Aggiunto automaticamente ai titoli degli articoli (es. "Guida Doganale | ShipTrack Parcel Intelligence")
            </p>
          </div>

          {/* Canonical URL Resolution Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Risoluzione URL Canonical
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Abilita i tag <code>rel="canonical"</code> per prevenire penalizzazioni di contenuti duplicati.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCanonicalEnabled(!canonicalEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                canonicalEnabled ? 'bg-[#1e3a8a]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform duration-200 ease-in-out ${
                  canonicalEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Default Global Meta Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Meta Descrizione Globale Default
            </label>
            <textarea
              rows={3}
              value={globalMetaDescription}
              onChange={(e) => setGlobalMetaDescription(e.target.value)}
              placeholder="ShipTrack CMS alimenta gli aggiornamenti ufficiali del blog e l'intelligence sul tracciamento dei pacchi..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSaveDefaults}
              className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#2563eb] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salva Default</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
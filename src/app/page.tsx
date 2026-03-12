'use client';

import { useState, useEffect } from 'react';
import { getFeaturedJobs, getCategories, getJobs } from '@/lib/api';
import { Job, Category } from '@/types';

import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/jobs/CategorySection';
import PromoBanner from '@/components/home/PromoBanner';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import LatestJobs from '@/components/home/LatestJobs';

export default function HomePage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getFeaturedJobs(),
      getCategories(),
      getJobs({ per_page: 6 }),
    ]).then(([feat, cats, latest]) => {
      setFeaturedJobs(feat.data.data || []);
      setCategories(cats.data.data || []);
      setLatestJobs(latest.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="bg-white">
      <HeroSection />
      <CategorySection categories={categories} />
      <PromoBanner />
      <FeaturedJobs jobs={featuredJobs} loading={loading} />
      <LatestJobs jobs={latestJobs} loading={loading} />
    </div>
  );
}

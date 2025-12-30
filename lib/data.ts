import { getSupabaseClient } from "./supabaseClient";

export type NewsItem = {
  title: string;
  slug?: string | null;
  category?: string | null;
  excerpt?: string | null;
  published_at?: string | null;
};

export type EventItem = {
  id?: string;
  title: string;
  slug?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  location?: string | null;
  status?: string | null;
  description?: string | null;
};

const fallbackNews: NewsItem[] = [
  {
    title: "إطلاق منصة الانتساب الرقمية",
    category: "إعلانات",
    excerpt: "تجربة انضمام سريعة مع خيارات دفع متعددة وشفافة.",
    published_at: "2024-07-10",
  },
  {
    title: "حملة دعم إنساني جديدة",
    category: "مبادرات",
    excerpt: "جمع تبرعات لمساندة الأسر المحتاجة خلال الصيف.",
    published_at: "2024-08-02",
  },
  {
    title: "فعالية ثقافية قادمة",
    category: "ثقافة",
    excerpt: "أمسية موسيقية مع معرض صور لتاريخ المدينة.",
    published_at: "2024-09-15",
  },
];

const fallbackEvents: { upcoming: EventItem[]; past: EventItem[] } = {
  upcoming: [
    { id: "fallback-evt-1", title: "ملتقى ثقافي", start_at: "2024-09-20", location: "باريس", description: "جلسة حوار ومعرض صور.", status: "upcoming" },
    { id: "fallback-evt-2", title: "حفل خيري", start_at: "2024-10-05", location: "ليون", description: "جمع تبرعات مع فقرات فنية.", status: "upcoming" },
  ],
  past: [
    { id: "fallback-evt-3", title: "أمسية أدبية", start_at: "2024-06-11", location: "مرسيليا", description: "قراءات شعرية وندوة.", status: "past" },
  ],
};

export async function fetchNews(): Promise<NewsItem[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackNews;

  const { data, error } = await supabase
    .from("news")
    .select("title, slug, category, body, published_at")
    .order("published_at", { ascending: false })
    .limit(12);

  if (error || !data) return fallbackNews;

  return data.map((item) => ({
    title: item.title,
    slug: item.slug,
    category: item.category,
    excerpt: item.body?.slice(0, 120) ?? null,
    published_at: item.published_at,
  }));
}

export async function fetchEvents(): Promise<{ upcoming: EventItem[]; past: EventItem[] }> {
  const supabase = getSupabaseClient();
  if (!supabase) return fallbackEvents;

  const { data, error } = await supabase
    .from("events")
    .select("id, title, slug, description, start_at, end_at, location, status")
    .order("start_at", { ascending: true })
    .limit(20);

  if (error || !data) return fallbackEvents;

  const upcoming: EventItem[] = [];
  const past: EventItem[] = [];
  data.forEach((event) => {
    if (event.status === "past") past.push(event);
    else upcoming.push(event);
  });

  return { upcoming, past };
}

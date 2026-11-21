/** @type {import('next').NextConfig} */
const statique = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  trailingSlash: true,
  // Export statique (aperçu sans serveur) : les routes API (.ts) sont exclues.
  ...(statique
    ? { output: "export", images: { unoptimized: true }, pageExtensions: ["tsx"] }
    : { pageExtensions: ["tsx", "ts"] }),
  env: { NEXT_PUBLIC_STATIQUE: statique ? "1" : "0" },
};

export default nextConfig;

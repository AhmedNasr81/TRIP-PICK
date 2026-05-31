import { useState } from "react";
import { useFavorites } from "@/hooks/api-hooks";
import { ProgramCard } from "@/components/program-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const { data: favorites, isLoading } = useFavorites(page, PAGE_SIZE);

  const hasPrev = page > 1;
  const hasNext = favorites !== undefined && favorites.length === PAGE_SIZE;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground">Programs you've saved for later.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))}
        </div>
      ) : favorites && favorites.length > 0 ? (
        <>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {favorites.map((program) => (
                <motion.div
                  key={program.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.22 } }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProgramCard program={program} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {(hasPrev || hasNext) && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <Button variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={!hasPrev}>
                Previous
              </Button>
              <span className="text-sm font-medium px-3 py-1.5 bg-muted rounded-md">Page {page}</span>
              <Button variant="outline" onClick={() => setPage(p => p + 1)} disabled={!hasNext}>
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full py-20 text-center bg-card rounded-2xl border border-dashed flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't saved any programs yet. Start exploring and heart your favorites!
          </p>
          <Link href="/programs">
            <Button>Explore Programs</Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}

"use client"

import { Post } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { BiLoaderCircle } from 'react-icons/bi';

export default function Page() {
  
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<Post[]>([]);
  
  const fetchPosts = async () => {
      try {
          setLoading(true);
          const response = await fetch('/api/image');
          const data = await response.json();
          console.log(data);
          // Check if data is an array; if not, set posts to an empty array
          setPosts(Array.isArray(data) ? data : []);
          //setPosts(data);
      } catch (error) {
          console.error(error);
          setPosts([]); // Set posts to an empty array if there's an error
      } finally{
          setLoading(false);
      };        
  }

  useEffect(()=>{
    fetchPosts();
  },[])

  return (
    <div className='w-full min-h-dvh p-3 pt-[72px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3'>
      {loading ? (
        <div className='col-span-full justify-center items-center flex'>
          <BiLoaderCircle className='animate-spin' />
        </div>
      ) : (
        <AnimatePresence mode='popLayout'>
          {posts.map((post, index) => {
              return (
                <motion.div
                  initial= {{ opacity: 0, scale: 0.9, filter: "blur(10px)"}}
                  animate= {{ opacity: 1, scale: 1, filter: "blur(0px)"}}
                  transition={{ duration: 0.2, delay: index * 0.05}} 
                  className='w-full h-full border rounded-md p-2.5' 
                  key={post.id}>
                <Image 
                  alt={post.prompt}  
                  src={post.url}
                  width={250}
                  height={250}
                  className='object-contain w-full h-full'
                />
                <p className='text-white/80'>{post.prompt}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
        )}
      </div>       
  );
}

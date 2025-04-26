'use client';

import { use } from 'react';
import ConnectionProfile from "../../components/connectionprofile";
import styles from "./connectionprofile.module.css";


interface ConnectionProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ConnectionProfilePage({ params }: ConnectionProfilePageProps) {
  const { id } = use(params);
  return <ConnectionProfile id={id} />;
} 
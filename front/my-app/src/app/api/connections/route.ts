import { NextResponse } from 'next/server';

// Shared state for connections
let connections = [
  {
    id: "1",
    name: "Connection 1",
    status: "Active",
    connectedDate: "Mon Jun 15 2025",
  },
  {
    id: "2",
    name: "Connection 2",
    status: "Inactive",
    connectedDate: "Mon Jun 15 2025",
  },
  {
    id: "3",
    name: "Connection 3",
    status: "Active",
    connectedDate: "Mon Jun 15 2025",
  },
  {
    id: "4",
    name: "Connection 4",
    status: "Active",
    connectedDate: "Mon Jun 15 2025",
  },
  {
    id: "5",
    name: "Connection 5",
    status: "Inactive",
    connectedDate: "Mon Jun 15 2025",
  },
];

export async function GET() {
  return NextResponse.json(connections);
}

export async function POST(request: Request) {
  try {
    const newConnection = await request.json();
    connections = [...connections, newConnection];
    return NextResponse.json(newConnection, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add connection' }, { status: 500 });
  }
} 
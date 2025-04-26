import { NextResponse } from 'next/server';

// Shared state for alerts
let alerts = [
  { id: '1', message: 'High temperature detected', type: 'Critical', date: 'Mon Jun 15 2025', status: 'Unread' },
  { id: '2', message: 'Low battery warning', type: 'Warning', date: 'Mon Jun 15 2025', status: 'Read' },
  { id: '3', message: 'Connection lost', type: 'Error', date: 'Mon Jun 15 2025', status: 'Unread' },
  { id: '4', message: 'System update available', type: 'Info', date: 'Mon Jun 15 2025', status: 'Read' },
  { id: '5', message: 'New device connected', type: 'Success', date: 'Mon Jun 15 2025', status: 'Unread' },
];

export async function GET() {
  return NextResponse.json(alerts);
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    alerts = alerts.filter(alert => alert.id !== id);
    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    alerts = alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'Read' } : alert
    );
    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
  }
} 
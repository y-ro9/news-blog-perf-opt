import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PerformanceOptimization from './PerformanceOptimization.jsx';
import { sanitizeInput } from '../utils/sanitize.js';

async function renderLoaded() {
  render(<PerformanceOptimization />);
  await screen.findByRole('heading', { name: /performance optimization/i });
  await waitFor(() =>
    expect(
      screen.queryByText(/loading performance tasks/i)
    ).not.toBeInTheDocument()
  );
}

describe('PerformanceOptimization', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders the main heading', async () => {
    await renderLoaded();
    expect(
      screen.getByRole('heading', { name: /performance optimization/i })
    ).toBeInTheDocument();
  });

  it('shows a loading indicator during async load', () => {
    render(<PerformanceOptimization />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('shows "No data found" when search yields no matches', async () => {
    await renderLoaded();
    const user = userEvent.setup();
    await user.type(
      screen.getByLabelText(/search tasks/i),
      'zzz-no-match-zzz'
    );
    expect(screen.getByText(/no data found/i)).toBeInTheDocument();
  });

  it('validates empty submission and flags the input', async () => {
    await renderLoaded();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /add task/i }));

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent(/required/i);

    const input = screen.getByLabelText(/new task title/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.className).toMatch(/po-input-error/);
  });

  it('adds a valid task and logs analytics', async () => {
    await renderLoaded();
    const user = userEvent.setup();
    await user.type(
      screen.getByLabelText(/new task title/i),
      'Minify CSS bundle'
    );
    await user.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() =>
      expect(screen.getByText('Minify CSS bundle')).toBeInTheDocument()
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Analytics] User interacted with Performance Optimization'
    );
  });

  it('sanitizes XSS payloads in the task title', async () => {
    await renderLoaded();
    const user = userEvent.setup();
    await user.type(
      screen.getByLabelText(/new task title/i),
      '<img src=x onerror=alert(1)>Safe title'
    );
    await user.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() =>
      expect(screen.getByText('Safe title')).toBeInTheDocument()
    );
    expect(screen.queryByText(/onerror/i)).not.toBeInTheDocument();
  });

  it('filters tasks by search term', async () => {
    await renderLoaded();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/search tasks/i), 'hero');
    expect(screen.getByText(/compress hero images/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/enable lazy loading/i)
    ).not.toBeInTheDocument();
  });

  it('toggling a task status fires analytics', async () => {
    await renderLoaded();
    const user = userEvent.setup();
    const [firstToggle] = screen.getAllByRole('button', {
      name: /mark .* as/i,
    });
    await user.click(firstToggle);
    expect(consoleSpy).toHaveBeenCalledWith(
      '[Analytics] User interacted with Performance Optimization'
    );
  });

  it('exposes labelled, keyboard-accessible controls', async () => {
    await renderLoaded();
    expect(screen.getByLabelText(/new task title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/search tasks/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add task/i })
    ).toBeInTheDocument();
    const toggleButtons = screen.getAllByRole('button', {
      name: /mark .* as/i,
    });
    expect(toggleButtons.length).toBeGreaterThan(0);
    toggleButtons.forEach((b) => expect(b).toHaveAttribute('aria-label'));
  });

  describe('sanitizeInput utility', () => {
    it('strips script tags', () => {
      expect(sanitizeInput('<script>alert(1)</script>Hello')).toBe('Hello');
    });
    it('strips javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
    });
    it('passes through clean text', () => {
      expect(sanitizeInput('Normal text')).toBe('Normal text');
    });
    it('returns empty string for non-string input', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
  });
});
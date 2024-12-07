import Image from 'next/image';
import Link from 'next/link';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className='transition-colors duration-200 text-gray-600 hover:text-purple-500'>
    {children}
  </Link>
);

export default function Header() {
  return (
    <nav className='container flex items-center justify-between px-8 py-8 mx-auto'>
      <div className='flex lg:flex-1'>
        <NavLink href='/'>
          <span className='flex items-center gap-2 shrink-0'>
            <Image
              className='hover:rotate-12 transform transition duration-200 ease-in-out'
              src='/icon.ico'
              alt='log'
              width={32}
              height={32}
            />
            <span className='font-extrabold text-lg'>Postcraft</span>
          </span>
        </NavLink>
      </div>
      <div className='flex lg:justify-center gap-2 lg:gap-12 lg:items-center'>
        <Link href='/#pricing'>Pricing</Link>
        <Link href='/#posts'>Your Posts</Link>
      </div>
    </nav>
  );
}

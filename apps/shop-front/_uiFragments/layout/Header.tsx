import {MiniCart} from "@/_domain/cart/useCases/showCart/ui/MiniCart";
import {User} from "lucide-react";

export const Header = () => {
  return (
    <div className={'bg-base-200 w-full py-4 shadow-lg mb-4'}>
      <div className={'container mx-auto flex justify-between items-center'}>
        <a href={'/'} className={'text-3xl font-bold'}>
          Electric Shoe Shop
        </a>
        <div className={'flex gap-4 items-center'}>
          <MiniCart/>
          <a href={'/user/profile'} className={'btn btn-ghost btn-circle'}>
            <User/>
          </a>
        </div>
      </div>
    </div>
  )
}

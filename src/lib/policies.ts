/**
 * Copy for the static policy pages (privacy, terms, exchange, returns,
 * shipping, order processing).
 *
 * The text lives here rather than in each page file so the shop can edit its
 * wording in one place, and every policy page renders through the same
 * component. These are sensible starting drafts for a Pakistani online
 * clothing store — have them reviewed before relying on them legally.
 */

import { CONTACTS, STORE } from "./seo";

export interface PolicySection {
  heading: string;
  /** Paragraphs; a nested array renders as a bullet list. */
  body: Array<string | string[]>;
}

export interface PolicyPageContent {
  slug: string;
  title: string;
  intro: string;
  sections: PolicySection[];
}

const PHONE = CONTACTS[0].display;
const CONTACT_LINE = `Questions? WhatsApp us on ${PHONE} or visit ${STORE.address}.`;

export const POLICIES: Record<string, PolicyPageContent> = {
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro:
      "We only collect what we need to get your order to your door, and we never sell your details to anyone.",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you place an order we ask for your name, phone number, delivery address, city and — optionally — an email address. That is all we store.",
          [
            "Name and phone number, so the courier can reach you",
            "Delivery address and city, so the parcel arrives",
            "Order contents, so we can pack and track it",
          ],
        ],
      },
      {
        heading: "How we use it",
        body: [
          "Your details are used to confirm the order on WhatsApp, hand the parcel to the courier, and answer any question you raise about that order. We may send you an occasional message about a new collection — tell us to stop and we will.",
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "Only the courier company delivering your parcel, and only the details they need for the delivery. We do not sell, rent or trade your information.",
        ],
      },
      {
        heading: "Payment information",
        body: [
          "Orders are cash on delivery. We never ask for, and never store, card or bank details on this website. If anyone claiming to be us asks you for an OTP or card number, it is not us — please report it.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You can ask us to show, correct or delete the details we hold about you at any time.",
          CONTACT_LINE,
        ],
      },
    ],
  },

  "terms-conditions": {
    slug: "terms-conditions",
    title: "Terms & Conditions",
    intro:
      "Using this website or placing an order means you agree to the terms below.",
    sections: [
      {
        heading: "Orders",
        body: [
          "Placing an order is an offer to buy. The order is confirmed once our team reaches you on WhatsApp or by phone. We may decline or cancel an order if the item is out of stock, the address is incomplete, or previous parcels to the same number were refused.",
        ],
      },
      {
        heading: "Prices and stock",
        body: [
          "All prices are in Pakistani Rupees and include applicable taxes. Prices and availability can change without notice; if the price of your item changed before we confirmed the order, we will tell you before dispatching.",
        ],
      },
      {
        heading: "Product images",
        body: [
          "We photograph every outfit ourselves. Colour can still look slightly different between screens, and fabric prints are cut individually, so the placement of a motif may vary a little from the picture.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "Photographs, designs and text on this site belong to us. Please do not reuse them commercially without permission.",
        ],
      },
      {
        heading: "Contact",
        body: [CONTACT_LINE],
      },
    ],
  },

  "exchange-policy": {
    slug: "exchange-policy",
    title: "Exchange Policy",
    intro:
      "Wrong size or a fault in the stitching? We will exchange it — here is how.",
    sections: [
      {
        heading: "What can be exchanged",
        body: [
          "Unworn, unwashed items with their original packaging intact, within 7 days of delivery.",
          [
            "Size does not fit (subject to stock in the size you need)",
            "A stitching or fabric fault",
            "The wrong article was delivered",
          ],
        ],
      },
      {
        heading: "What cannot be exchanged",
        body: [
          [
            "Items custom-stitched to your own measurements",
            "Sale or clearance items marked non-exchangeable",
            "Worn, washed, altered or stained items",
          ],
        ],
      },
      {
        heading: "How to request one",
        body: [
          `WhatsApp us on ${PHONE} within 7 days of delivery with your order number and a clear photo of the item. We will confirm the exchange and share the return address.`,
          "Once your parcel reaches us and passes a quick check, the replacement is dispatched within 2 working days.",
        ],
      },
      {
        heading: "Who pays the courier",
        body: [
          "If the fault is ours — wrong item, damaged parcel, stitching defect — we cover the return and re-delivery charges. For a size change, the return charge is yours and we cover the re-delivery.",
        ],
      },
    ],
  },

  "return-refund-policy": {
    slug: "return-refund-policy",
    title: "Return & Refund Policy",
    intro:
      "We would rather fix a problem than leave you with an outfit you cannot wear.",
    sections: [
      {
        heading: "Return window",
        body: [
          "Returns are accepted within 7 days of delivery, for unworn and unwashed items in their original packaging with all tags attached.",
        ],
      },
      {
        heading: "Non-returnable items",
        body: [
          [
            "Custom-stitched pieces made to your measurements",
            "Items marked final sale or clearance",
            "Anything worn, washed, altered or damaged after delivery",
          ],
        ],
      },
      {
        heading: "How refunds are paid",
        body: [
          "Because orders are cash on delivery, refunds are sent by bank transfer, EasyPaisa or JazzCash to the account you nominate.",
          "Once the returned parcel reaches us and passes inspection, the refund is issued within 5 to 7 working days. Delivery charges are refunded only where the fault was ours.",
        ],
      },
      {
        heading: "Damaged or wrong parcels",
        body: [
          `Please record a short unboxing video where you can. If the parcel arrives damaged or contains the wrong item, WhatsApp us on ${PHONE} within 48 hours and we will replace it at our cost.`,
        ],
      },
    ],
  },

  "shipping-policy": {
    slug: "shipping-policy",
    title: "Shipping Policy",
    intro: "We deliver all across Pakistan, cash on delivery.",
    sections: [
      {
        heading: "Delivery time",
        body: [
          "Orders are dispatched within 24 hours of confirmation on working days. Delivery typically takes 2 to 3 working days for Karachi, Lahore and Islamabad, and 3 to 5 working days elsewhere in Pakistan.",
        ],
      },
      {
        heading: "Charges",
        body: [
          "A flat delivery charge is shown at checkout before you confirm. Orders over Rs. 5,000 ship free.",
        ],
      },
      {
        heading: "Cash on delivery",
        body: [
          "Pay the courier in cash when the parcel reaches you. Please keep the exact amount ready, and check that the packaging is sealed before paying.",
        ],
      },
      {
        heading: "Failed deliveries",
        body: [
          "Couriers attempt delivery up to three times. If nobody is reachable on the number given, the parcel returns to us and the order is cancelled. Repeatedly refused parcels may mean we ask for advance payment on future orders.",
        ],
      },
      {
        heading: "Tracking",
        body: [
          "Your order number is shared on WhatsApp once the order is confirmed. Track its progress any time on our Track Your Order page.",
        ],
      },
    ],
  },

  "order-processing": {
    slug: "order-processing",
    title: "Order Processing",
    intro: "What happens between you pressing “Place order” and the doorbell.",
    sections: [
      {
        heading: "1. Order placed",
        body: [
          "You will see an order number on screen — something like CP-2026-0042. Save it; it is what you need to track the order.",
        ],
      },
      {
        heading: "2. Confirmation call",
        body: [
          "Our team reaches you on WhatsApp or by phone within a few hours to confirm the article, the size and the address.",
        ],
      },
      {
        heading: "3. Packing and dispatch",
        body: [
          "Once confirmed, the outfit is checked, pressed, packed and handed to the courier within 24 hours on working days.",
        ],
      },
      {
        heading: "4. On its way",
        body: [
          "The order status moves to Shipped. From here it is with the courier, and typically arrives within 2 to 5 working days.",
        ],
      },
      {
        heading: "5. Delivered",
        body: [
          "Pay the courier in cash, open the parcel and try the outfit on. If anything is wrong, our exchange window runs for 7 days from this point.",
        ],
      },
    ],
  },
};

export const POLICY_SLUGS = Object.keys(POLICIES);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlan = exports.BillingStatus = void 0;
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["DRAFT"] = "draft";
    BillingStatus["SENT"] = "sent";
    BillingStatus["PAID"] = "paid";
    BillingStatus["OVERDUE"] = "overdue";
    BillingStatus["CANCELLED"] = "cancelled";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["BASIC"] = "basic";
    SubscriptionPlan["PREMIUM"] = "premium";
    SubscriptionPlan["ENTERPRISE"] = "enterprise";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
//# sourceMappingURL=billing-status.enum.js.map
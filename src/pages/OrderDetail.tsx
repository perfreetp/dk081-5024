import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Shield,
  Package,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  MessageCircle,
  Copy,
  UserCheck,
  Wallet,
  Star,
} from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { useAppStore } from '@/store';
import { formatPrice, formatDate, formatTime } from '@/utils/format';
import type { OrderStage, OrderStageType } from '@/types';

const stageIconMap: Record<OrderStageType, typeof CheckCircle2> = {
  order_created: Package,
  mediator_assigned: UserCheck,
  seller_preparing: User,
  account_verified: Shield,
  buyer_confirmed: CheckCircle2,
  fund_released: Wallet,
  completed: Star,
  disputed: AlertTriangle,
};

const stageRoleColor = {
  buyer: 'text-neon-cyan',
  seller: 'text-neon-orange',
  mediator: 'text-neon-purple',
  system: 'text-white/60',
};

const stageRoleBg = {
  buyer: 'bg-neon-cyan/20',
  seller: 'bg-neon-orange/20',
  mediator: 'bg-neon-purple/20',
  system: 'bg-white/10',
};

const roleLabel = {
  buyer: '买家',
  seller: '卖家',
  mediator: '中介',
  system: '系统',
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId = '' } = useParams();
  const getOrderById = useAppStore((s) => s.getOrderById);
  const advanceOrderStage = useAppStore((s) => s.advanceOrderStage);
  const mediators = useAppStore((s) => s.mediators);
  const users = useAppStore((s) => s.users);
  const posts = useAppStore((s) => s.posts);
  const currentUser = useAppStore((s) => s.currentUser);

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <Container>
        <Link to="/profile" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-5 transition-colors">
          <ChevronLeft size={18} />
          返回
        </Link>
        <div className="glass-card p-10 text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-neon-orange opacity-60" />
          <h2 className="text-xl font-bold text-white mb-2">订单不存在</h2>
          <p className="text-white/50 mb-6">找不到对应的订单，请检查订单号是否正确</p>
          <button onClick={() => navigate('/profile')} className="btn-gradient">
            返回个人中心
          </button>
        </div>
      </Container>
    );
  }

  const mediator = mediators.find((m) => m.id === order.mediatorId);
  const buyer = users.find((u) => u.id === order.buyerId);
  const seller = users.find((u) => u.id === order.sellerId);
  const post = posts.find((p) => p.id === order.postId);
  const isBuyer = currentUser.id === order.buyerId;
  const isSeller = currentUser.id === order.sellerId;

  const currentStageIndex = order.stages.findIndex((s) => s.type === order.currentStage);

  const statusText = {
    pending: '待支付',
    paid: '已支付',
    delivering: '交易中',
    completed: '已完成',
    disputed: '纠纷中',
    cancelled: '已取消',
  };

  const handleCopyOrderId = () => {
    navigator.clipboard?.writeText(order.id);
    alert('订单号已复制');
  };

  const handleAdvanceStage = (note?: string) => {
    if (!order) return;
    advanceOrderStage(order.id, note);
  };

  const canSellerSubmit = isSeller && order.status === 'delivering' && order.currentStage === 'mediator_assigned';
  const canBuyerConfirm = isBuyer && order.status === 'delivering' && order.currentStage === 'account_verified';

  return (
    <Container>
      <Link to="/profile" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-5 transition-colors">
        <ChevronLeft size={18} />
        返回订单列表
      </Link>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-white/50 mb-1">订单状态</p>
              <h1 className="text-2xl font-bold text-gradient">{statusText[order.status]}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/50 mb-1">订单金额</p>
              <p className="text-2xl font-bold text-white">{formatPrice(order.amount)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 text-sm">
            <span className="text-white/50">订单号：</span>
            <span className="text-white font-mono">{order.id}</span>
            <button onClick={handleCopyOrderId} className="ml-auto text-white/40 hover:text-white transition-colors">
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={20} className="text-neon-purple" />
            <h2 className="text-lg font-bold text-white">交易进度</h2>
          </div>

          <div className="relative pl-6 space-y-0">
            {order.stages.map((stage: OrderStage, idx: number) => {
              const isCompleted = stage.completedAt !== undefined;
              const isCurrent = idx === currentStageIndex && !isCompleted;
              const StageIcon = stageIconMap[stage.type] || Clock;
              const isLast = idx === order.stages.length - 1;

              return (
                <div key={stage.type} className="relative pb-6 last:pb-0">
                  {!isLast && (
                    <div
                      className={`absolute left-[15px] top-8 w-0.5 h-full -translate-x-1/2 ${
                        isCompleted ? 'bg-neon-purple/60' : 'bg-white/10'
                      }`}
                    />
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted || isCurrent
                          ? stageRoleBg[stage.role]
                          : 'bg-white/10'
                      }`}
                    >
                      <StageIcon
                        size={16}
                        className={
                          isCompleted || isCurrent
                            ? stageRoleColor[stage.role]
                            : 'text-white/30'
                        }
                      />
                      {isCurrent && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-neon-purple ring-offset-2 ring-offset-dark-900 animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`font-medium ${
                            isCompleted || isCurrent ? 'text-white' : 'text-white/40'
                          }`}
                        >
                          {stage.title}
                        </h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${stageRoleBg[stage.role]} ${stageRoleColor[stage.role]}`}
                        >
                          {roleLabel[stage.role]}
                        </span>
                      </div>
                      <p
                        className={`text-sm ${
                          isCompleted || isCurrent ? 'text-white/60' : 'text-white/30'
                        }`}
                      >
                        {stage.description}
                      </p>
                      {stage.completedAt && (
                        <p className="text-xs text-white/40 mt-1">
                          {formatDate(stage.completedAt)} {formatTime(stage.completedAt)}
                        </p>
                      )}
                      {stage.note && (
                        <p className="text-xs text-neon-cyan/70 mt-1">
                          💡 {stage.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {(isBuyer || isSeller) && order.status === 'delivering' && (
            <div className="mt-6 p-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20">
              <p className="text-sm text-white/80">
                {isBuyer
                  ? '💡 提示：请耐心等待中介联系您进行账号交接。如有疑问可在下方联系中介。'
                  : '💡 提示：请配合中介完成账号交接，确保买家确认后再完成交易。'}
              </p>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-neon-cyan" />
            <h3 className="font-semibold text-white">商品信息</h3>
          </div>

          {post ? (
            <Link to={`/trade/${post.id}`} className="flex gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <img
                src={order.postCover}
                alt={order.postTitle}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{order.postTitle}</p>
                <p className="text-sm text-white/50 mt-1">
                  {post.rank} · {post.server}
                </p>
                <p className="text-sm text-gradient font-semibold mt-2">
                  {formatPrice(order.amount)}
                </p>
              </div>
              <Eye size={16} className="text-white/40 shrink-0 self-center" />
            </Link>
          ) : (
            <div className="flex gap-4 p-3 rounded-xl bg-white/5">
              <img
                src={order.postCover}
                alt={order.postTitle}
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{order.postTitle}</p>
                <p className="text-sm text-gradient font-semibold mt-2">
                  {formatPrice(order.amount)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-neon-purple" />
            <h3 className="font-semibold text-white">交易参与方</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {buyer && (
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan">买家</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={buyer.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-sm text-white truncate">{buyer.nickname}</span>
                </div>
              </div>
            )}
            {seller && (
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-orange/20 text-neon-orange">卖家</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={seller.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-sm text-white truncate">{seller.nickname}</span>
                </div>
              </div>
            )}
            {mediator && (
              <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple">担保中介</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={mediator.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <span className="text-sm text-white">{mediator.nickname}</span>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] text-white/50">{mediator.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">费用明细</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">商品价格</span>
              <span className="text-white">{formatPrice(Math.round(order.amount / 1.03))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">中介服务费（约3%）</span>
              <span className="text-white">{formatPrice(order.amount - Math.round(order.amount / 1.03))}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/5">
              <span className="text-white font-medium">实付金额</span>
              <span className="text-lg font-bold text-gradient">{formatPrice(order.amount)}</span>
            </div>
          </div>
        </div>

        {order.status !== 'completed' && order.status !== 'cancelled' && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-neon-cyan" />
              <h3 className="font-semibold text-white">当前操作</h3>
            </div>

            {order.currentStage === 'order_created' && (
              <div className="p-3 rounded-xl bg-white/5 mb-4">
                <p className="text-sm text-white/60">
                  订单已创建，等待中介接单介入...
                </p>
              </div>
            )}
            {order.currentStage === 'mediator_assigned' && isSeller && (
              <div className="p-3 rounded-xl bg-neon-orange/10 border border-neon-orange/20 mb-4">
                <p className="text-sm text-white/80">
                  📦 中介已介入，请尽快准备账号资料并提交给中介
                </p>
              </div>
            )}
            {order.currentStage === 'seller_preparing' && isBuyer && (
              <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 mb-4">
                <p className="text-sm text-white/80">
                  ⏳ 卖家正在交接账号，中介验证完成后会通知您
                </p>
              </div>
            )}
            {order.currentStage === 'account_verified' && isBuyer && (
              <div className="p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/20 mb-4">
                <p className="text-sm text-white/80">
                  ✅ 中介已验证账号信息，请确认收货后完成交易
                </p>
              </div>
            )}
            {order.currentStage === 'buyer_confirmed' && (
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                <p className="text-sm text-white/80">
                  💰 买家已确认收货，平台正在处理放款...
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button className="btn-outline flex-1 flex items-center justify-center gap-2">
                <MessageCircle size={16} />
                联系中介
              </button>

              {canSellerSubmit && (
                <button
                  onClick={() => handleAdvanceStage('卖家已提交账号资料，包含账号密码和绑定信息')}
                  className="btn-gradient flex-1 flex items-center justify-center gap-2"
                >
                  <Package size={16} />
                  提交账号信息
                </button>
              )}

              {canBuyerConfirm && (
                <button
                  onClick={() => handleAdvanceStage('买家确认账号无误，同意放款')}
                  className="btn-gradient flex-1 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  确认收货
                </button>
              )}
            </div>
          </div>
        )}

        {order.status === 'completed' && (
          <div className="glass-card p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
                <Star size={32} className="text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">交易已完成</h3>
              <p className="text-sm text-white/50">感谢您的信任，欢迎再次光临</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-outline flex-1">查看详情</button>
              <button className="btn-gradient flex-1">去评价</button>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

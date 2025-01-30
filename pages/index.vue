<script setup lang="ts">
    import { cn } from '~/lib/cn';

    const count = ref(2)

    const split = ref(25)

    const charges = ref<number>(1000)
    const incomes = ref([1000, 2000])
    const totalIncome = computed(() => incomes.value.reduce((acc, current) => acc + Math.max(current, 0), 0))
    const outcomes = ref<Array<number>>([])

    function interpolate(X: number, controlPoints: { X: number, f: number }[]) {
        // Sort the control points by X value
        controlPoints.sort((a, b) => a.X - b.X)

        // Find the two points between which we need to interpolate
        for (let i = 0; i < controlPoints.length - 1; i++) {
            const p1 = controlPoints[i];
            const p2 = controlPoints[i + 1];

            // If X is between p1.X and p2.X, calculate the interpolated value
            if (X >= p1.X && X <= p2.X) {
                const slope = (p2.f - p1.f) / (p2.X - p1.X);
                return p1.f + slope * (X - p1.X);
            }
        }

        // If X is outside the bounds, return null or throw an error
        return controlPoints.at(-1)?.f || 0;
    }

    watchEffect(() => {
        incomes.value.forEach(
            (income, index) => {
                let scale = index == 0 ? 1 - (split.value / 50) : 1 + (split.value / 50)
                let outcome = (income / (totalIncome.value)) * charges.value
                outcomes.value[index] = Number((interpolate(scale, [{ X: 0, f: 0 }, { X: 1, f: outcome }, { X: 2, f: charges.value }])).toFixed(2))
            }
        )
    })

</script>

<template>
    <UCard :class="cn('max-w-lg w-full')">
        <template #default>
            <div :class="cn('flex flex-col', 'gap-4')">
                <div :class="cn('flex justify-around')">
                    <label :class="cn('flex flex-col items-center', 'gap-2', 'my-1')">
                        <span>Charges</span>
                        <UInput v-model="charges" type="number" :trailing-icon="'i-heroicons-currency-euro'" />
                    </label>
                </div>
                <div :class="cn('flex')">
                    <div :class="cn('flex justify-around flex-grow', 'overflow-auto')">
                        <label v-for="index of count" :key="index"
                            :class="cn('flex flex-col items-center', 'gap-2', 'my-1')">
                            <span>Income {{ index }}</span>
                            <UInput v-model="incomes[index - 1]" type="number"
                                :trailing-icon="'i-heroicons-currency-euro'" />
                        </label>
                    </div>
                </div>
                <div :class="cn('flex flex-col')">
                    <div :class="cn('flex justify-between')">
                        <span :class="cn('text-start')">{{ 50 - split }} %</span>
                        <span :class="cn('text-end')">{{ 50 + split }} %</span>
                    </div>
                    <URange :class="cn('col-span-2')" v-model="split" :min="-50" :max="50" />
                </div>
                <div :class="cn('flex')">
                    <div :class="cn('flex justify-around flex-grow', 'overflow-auto')">
                        <label v-for="index of count" :key="index"
                            :class="cn('flex flex-col items-center', 'gap-2', 'my-1')">
                            <span>Needs to pay</span>
                            <UInput disabled v-model="outcomes[index - 1]" :trailing-icon="'i-heroicons-currency-euro'" />
                        </label>
                    </div>
                </div>
            </div>
        </template>
    </UCard>
</template>